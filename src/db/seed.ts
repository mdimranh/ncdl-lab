import { existsSync } from "node:fs";
import { eq } from "drizzle-orm";
import { db, pool } from "./index";
import {
  collaborations,
  gallery,
  members,
  news,
  positions,
  projects,
  publications,
  researchAreas,
  siteSettings,
  users,
} from "./schema";
import { hashPassword } from "../lib/password";
import {
  areaKorean,
  memberKorean,
  newsKorean,
  positionKorean,
  publicationKorean,
  settingsKorean,
} from "./seed-ko";

if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

const areas = [
  {
    slug: "neuromorphic-circuit-design",
    title: "Neuromorphic Circuit Design",
    tagline: "Brain-inspired silicon, from device physics to architecture",
    icon: "cpu",
    summary:
      "We design mixed-signal and digital circuits that emulate the spiking dynamics of biological neurons and synapses, targeting always-on inference at microwatt power budgets.",
    overview:
      "Our neuromorphic programme spans the full stack of brain-inspired hardware: compact neuron and synapse primitives in advanced CMOS, memristive device characterisation, event-driven network-on-chip fabrics, and the learning rules that run on them. The group works closely with device physicists and algorithm researchers so that silicon-level non-idealities — mismatch, leakage, conductance drift — are modelled early and compensated in architecture rather than after tape-out.\n\nCurrent silicon generations integrate leaky integrate-and-fire neurons with programmable synaptic arrays and asynchronous address-event routing. A closed-loop design flow links behavioural simulation in Python, transistor-level verification, and post-layout power/area modelling, letting us iterate on a new accelerator concept within a single semester.",
    objectives: [
      "Develop sub-picojoule-per-synapse primitives for always-on edge inference.",
      "Model and compensate device non-idealities in mixed-signal learning circuits.",
      "Build scalable, deadlock-free address-event routing fabrics for multi-core arrays.",
      "Deliver open, reproducible reference designs for the neuromorphic research community.",
    ],
    methodologies: [
      "Cadence Virtuoso schematic and layout in 28 nm and 65 nm CMOS.",
      "Spectre/AMS co-simulation of neuron and synapse dynamics.",
      "Behavioural modelling in Brian2 and Nengo for algorithm–hardware co-design.",
      "Post-layout Monte Carlo analysis across PVT corners.",
      "FPGA prototyping of digital spiking fabrics before tape-out.",
    ],
    keywords: ["spiking neural networks", "memristors", "analog VLSI", "event-driven SoC"],
    displayOrder: 1,
  },
  {
    slug: "rf-analog-circuit-design",
    title: "RF & Analog Circuit Design",
    tagline: "Front-ends that hear the faintest signals",
    icon: "radio",
    summary:
      "Low-noise amplifiers, mixers and data converters for neural recording, radar sensing and wirelessly powered implantable devices.",
    overview:
      "The RF and analog group develops energy-efficient front-ends where noise, linearity and power are traded with care. We work on broadband LNAs for 60 GHz sensing, chopper-stabilised amplifiers for microvolt neural signals, and successive-approximation ADCs that pair with our neuromorphic cores.\n\nEvery design is measured. The laboratory maintains a probe station, a vector network analyser up to 67 GHz, and a shielded measurement bench for noise figure and phase-noise characterisation, so simulation and silicon are compared on the same bench within weeks of fabrication.",
    objectives: [
      "Design sub-1 dB noise figure receivers for millimetre-wave sensing.",
      "Achieve sub-10 µW per channel neural recording front-ends.",
      "Co-design data converters with event-driven compute to remove conversion bottlenecks.",
      "Publish full measurement datasets alongside every silicon prototype.",
    ],
    methodologies: [
      "Load-pull and noise-parameter characterisation up to 67 GHz.",
      "Electromagnetic co-simulation in ADS and HFSS.",
      "Chopper stabilisation and offset rejection for biopotential amplifiers.",
      "Correlated double sampling SAR ADC architectures.",
    ],
    keywords: ["LNA", "millimetre-wave", "neural recording", "SAR ADC"],
    displayOrder: 2,
  },
  {
    slug: "fpga-circuit-and-image-analysis",
    title: "FPGA-Based Circuit & Image Analysis",
    tagline: "Deterministic, real-time vision at the edge",
    icon: "scan",
    summary:
      "Hardware/software co-design of image-processing pipelines on FPGA and SoC platforms, with deterministic latency for robotics and industrial inspection.",
    overview:
      "FPGA platforms give us a way to test spiking and streaming vision algorithms at frame rate before committing to silicon. Our pipelines combine event-camera interfaces, low-latency convolution engines and on-chip segmentation with tight, cycle-accurate latency guarantees.\n\nWe maintain a shared RTL library — line buffers, separable filters, connected-component labelling and AXI stream infrastructure — that students reuse across projects, shortening the path from idea to a working demonstrator on a Zynq or Versal board.",
    objectives: [
      "Deliver sub-5 ms end-to-end vision pipelines for embedded robotics.",
      "Provide reusable, verified RTL blocks for streaming image processing.",
      "Bridge event-based sensing with conventional frame-based CNN accelerators.",
      "Keep power below 3 W for battery-powered field deployment.",
    ],
    methodologies: [
      "SystemVerilog RTL with UVM-lite testbenches and formal property checks.",
      "High-level synthesis (Vitis HLS) for rapid design-space exploration.",
      "Zynq/Versal prototyping with PYNQ-based host interfaces.",
      "On-board power and thermal measurement during field trials.",
    ],
    keywords: ["RTL", "HLS", "event cameras", "embedded vision"],
    displayOrder: 3,
  },
  {
    slug: "robotics-control-circuit-design",
    title: "Robotics Control Circuit Design",
    tagline: "Custom electronics for machines that move",
    icon: "bot",
    summary:
      "Motor drivers, sensor interfaces and real-time control boards that close the loop between neuromorphic inference and physical actuation.",
    overview:
      "Intelligence only matters when it acts. This area builds the electronics that translate neural output into smooth, safe motion: field-oriented motor control on custom boards, encoder and IMU interfaces with microsecond timestamping, and power stages sized for legged and wheeled platforms.\n\nWe prototype on a quadruped testbed and a six-axis manipulator, using ROS 2 on the host and a deterministic control loop on the microcontroller. The same boards are used for teaching, so students see the full path from schematic to a walking robot.",
    objectives: [
      "Close a 1 kHz current loop with custom GaN-based motor drivers.",
      "Timestamp sensor events to 1 µs for spiking control policies.",
      "Reduce actuator electronics mass and volume by 40% versus commercial stacks.",
      "Validate every controller on hardware-in-the-loop benches before deployment.",
    ],
    methodologies: [
      "Field-oriented control on Cortex-M7 and RISC-V microcontrollers.",
      "Custom four-layer PCB design with isolated gate drivers.",
      "Hardware-in-the-loop testing with ROS 2 and a real-time joint simulator.",
      "Thermal and EMI characterisation of power stages.",
    ],
    keywords: ["FOC", "GaN drivers", "ROS 2", "legged robotics"],
    displayOrder: 4,
  },
];

async function main() {
  console.log("Seeding NCDL database…");

  // Idempotent reseed: clear child tables first.
  await db.delete(publications);
  await db.delete(projects);
  await db.delete(members);
  await db.delete(news);
  await db.delete(positions);
  await db.delete(gallery);
  await db.delete(collaborations);
  await db.delete(researchAreas);
  await db.delete(users);
  await db.delete(siteSettings);

  const insertedAreas = await db.insert(researchAreas).values(areas).returning();
  const areaId = (slug: string) =>
    insertedAreas.find((area) => area.slug === slug)?.id ?? null;

  // Presentation details used by the public research pages.
  const areaPresentation: Record<
    string,
    { publishedAt: string; figures: { imageUrl: string; caption: string }[] }
  > = {
    "neuromorphic-circuit-design": {
      publishedAt: "2026-10-20",
      figures: [
        {
          imageUrl: "/images/lab/die.svg",
          caption: "NCDL-SPARK: sixteen spiking cores integrated on a 28 nm die.",
        },
        {
          imageUrl: "/images/lab/wafer.svg",
          caption: "Shuttle wafer carrying the memristive synapse test structures.",
        },
        {
          imageUrl: "/images/lab/neural.svg",
          caption: "Measured event rate versus supply voltage across PVT corners.",
        },
      ],
    },
    "rf-analog-circuit-design": {
      publishedAt: "2026-09-14",
      figures: [
        {
          imageUrl: "/images/lab/scope.svg",
          caption: "67 GHz on-wafer noise-figure and load-pull measurement bench.",
        },
        {
          imageUrl: "/images/lab/pcb.svg",
          caption: "Neural-recording front-end evaluation board with chopper stabilisation.",
        },
      ],
    },
    "fpga-circuit-and-image-analysis": {
      publishedAt: "2026-08-05",
      figures: [
        {
          imageUrl: "/images/lab/pcb.svg",
          caption: "FPGA vision platform with dual camera interfaces and DDR4 capture.",
        },
        {
          imageUrl: "/images/lab/neural.svg",
          caption: "Frame-level latency of the event-driven detector at 120 fps.",
        },
      ],
    },
    "robotics-control-circuit-design": {
      publishedAt: "2026-07-18",
      figures: [
        {
          imageUrl: "/images/lab/pcb.svg",
          caption: "GaN motor-driver stack used on the quadruped platform.",
        },
        {
          imageUrl: "/images/lab/die.svg",
          caption: "Spiking locomotion controller test chip after packaging.",
        },
      ],
    },
  };

  for (const [slug, patch] of Object.entries(areaPresentation)) {
    await db.update(researchAreas).set(patch).where(eq(researchAreas.slug, slug));
  }

  for (const [slug, patch] of Object.entries(areaKorean)) {
    await db.update(researchAreas).set(patch).where(eq(researchAreas.slug, slug));
  }

  await db.insert(siteSettings).values({
    id: 1,
    labName: "Neuromorphic Chip Design Laboratory",
    shortName: "NCDL",
    institution: "Department of Electrical & Electronic Engineering",
    tagline:
      "Brain-inspired silicon for the next generation of intelligent machines.",
    motto: "Learn from the brain. Build it in silicon.",
    mission:
      "NCDL exists to close the gap between how biological brains compute and how machines are built. We design custom integrated circuits, RF front-ends and FPGA systems that bring event-driven, energy-proportional intelligence to devices that must run for months on a coin cell — and we train the next generation of engineers who can take a concept from a whiteboard to a measured silicon die.",
    foundingYear: 2018,
    address:
      "Room 402, Academic Building B, Department of Electrical & Electronic Engineering, University Campus, Dhaka 1207, Bangladesh",
    phone: "+880 2 5555 0182",
    fax: "+880 2 5555 0183",
    email: "contact@ncdl-lab.org",
    officeHours: "Sunday – Thursday · 09:00 – 17:00 (GMT+6)",
    mapQuery: "Dhaka 1207, Bangladesh",
    linkedinUrl: "https://www.linkedin.com/",
    scholarUrl: "https://scholar.google.com/",
    githubUrl: "https://github.com/",
    youtubeUrl: "https://www.youtube.com/",
  });

  await db.update(siteSettings).set(settingsKorean).where(eq(siteSettings.id, 1));

  await db.insert(users).values([
    {
      email: "admin@ncdl-lab.org",
      name: "Lab Administrator",
      title: "Website Administrator",
      passwordHash: hashPassword("admin1234"),
      role: "admin",
    },
    {
      email: "faculty@ncdl-lab.org",
      name: "Dr. Ayesha Rahman",
      title: "Professor & Director",
      passwordHash: hashPassword("faculty1234"),
      role: "faculty",
    },
  ]);

  await db.insert(members).values([
    {
      slug: "ayesha-rahman",
      name: "Ayesha Rahman",
      category: "professor",
      designation: "Professor & Director, NCDL",
      email: "ayesha.rahman@ncdl-lab.org",
      phone: "+880 2 5555 0182",
      bio: "Ayesha Rahman leads NCDL and holds a chair in the Department of Electrical & Electronic Engineering. Her work sits at the boundary of device physics and computer architecture, with a focus on spiking accelerators that can operate in the microwatt regime. She has taped out seven test chips, supervises twelve doctoral students, and teaches the graduate sequence on analog integrated circuit design.\n\nBefore returning to academia she spent four years in industry designing data converters for implantable medical devices, an experience that still shapes the lab's insistence on measured, not simulated, results.",
      interests: [
        "Neuromorphic computing",
        "Mixed-signal VLSI",
        "Low-power SoCs",
        "Memristive devices",
      ],
      education: [
        { degree: "PhD, Electrical Engineering", institution: "ETH Zürich", year: "2013" },
        { degree: "MSc, Microelectronics", institution: "TU Delft", year: "2008" },
        { degree: "BSc, Electrical & Electronic Engineering", institution: "BUET", year: "2006" },
      ],
      scholarUrl: "https://scholar.google.com/",
      orcidUrl: "https://orcid.org/",
      joinedYear: 2018,
      displayOrder: 1,
    },
    {
      slug: "markus-lindqvist",
      name: "Markus Lindqvist",
      category: "professor",
      designation: "Professor, RF & Analog IC Design",
      email: "markus.lindqvist@ncdl-lab.org",
      bio: "Markus Lindqvist directs the RF and analog front-end programme. His research covers millimetre-wave receivers, low-noise amplifier topologies and the co-design of data converters with event-driven compute. He maintains the lab's 67 GHz measurement bench and runs the annual mmWave design workshop.",
      interests: ["mmWave circuits", "Low-noise amplifiers", "Data converters", "EM co-simulation"],
      education: [
        { degree: "PhD, Microwave Engineering", institution: "Chalmers University of Technology", year: "2011" },
        { degree: "MSc, Electrical Engineering", institution: "KTH Royal Institute of Technology", year: "2006" },
      ],
      scholarUrl: "https://scholar.google.com/",
      joinedYear: 2019,
      displayOrder: 2,
    },
    {
      slug: "tanvir-hasan",
      name: "Tanvir Hasan",
      category: "professor",
      designation: "Associate Professor, Embedded Systems",
      email: "tanvir.hasan@ncdl-lab.org",
      bio: "Tanvir Hasan works on FPGA-based real-time vision and the embedded software that surrounds custom hardware. He leads the lab's RTL library effort and the collaboration with the robotics group on deterministic perception pipelines.",
      interests: ["FPGA architecture", "Embedded vision", "HLS", "Real-time systems"],
      education: [
        { degree: "PhD, Computer Engineering", institution: "National University of Singapore", year: "2015" },
        { degree: "BSc, Computer Science & Engineering", institution: "BUET", year: "2009" },
      ],
      joinedYear: 2020,
      displayOrder: 3,
    },
    {
      slug: "sadia-islam",
      name: "Sadia Islam",
      category: "phd",
      designation: "PhD Candidate · Neuromorphic Devices",
      email: "sadia.islam@ncdl-lab.org",
      bio: "Sadia studies conductance drift in memristive synapse arrays and the compensation circuits that keep on-chip learning stable over months of operation. She built the lab's automated device-characterisation rig.",
      interests: ["Memristive synapses", "On-chip learning", "Device modelling"],
      education: [
        { degree: "MSc, Electrical Engineering", institution: "BUET", year: "2021" },
        { degree: "BSc, Electrical & Electronic Engineering", institution: "KUET", year: "2018" },
      ],
      scholarUrl: "https://scholar.google.com/",
      joinedYear: 2021,
      displayOrder: 1,
    },
    {
      slug: "rezaul-karim",
      name: "Rezaul Karim",
      category: "phd",
      designation: "PhD Candidate · Spiking Accelerators",
      email: "rezaul.karim@ncdl-lab.org",
      bio: "Rezaul is architecting a multi-core address-event fabric that sustains 10⁹ synaptic events per second within a 50 mW envelope. His test chip is scheduled for the next shuttle run.",
      interests: ["Network-on-chip", "Spiking architectures", "Digital VLSI"],
      education: [
        { degree: "MSc, Microelectronics", institution: "University of Dhaka", year: "2020" },
        { degree: "BSc, EEE", institution: "RUET", year: "2017" },
      ],
      joinedYear: 2020,
      displayOrder: 2,
    },
    {
      slug: "wei-chen",
      name: "Wei Chen",
      category: "phd",
      designation: "PhD Candidate · Event-Based Vision",
      email: "wei.chen@ncdl-lab.org",
      bio: "Wei bridges event cameras and spiking classifiers, designing an interface ASIC that timestamps incoming events to one microsecond and feeds them directly into the lab's accelerator.",
      interests: ["Event cameras", "Sensor interfaces", "Neuromorphic vision"],
      education: [
        { degree: "MEng, Integrated Circuit Engineering", institution: "Zhejiang University", year: "2021" },
        { degree: "BEng, Electronics", institution: "Harbin Institute of Technology", year: "2018" },
      ],
      joinedYear: 2022,
      displayOrder: 3,
    },
    {
      slug: "nusrat-jahan",
      name: "Nusrat Jahan",
      category: "phd",
      designation: "PhD Candidate · Robotics Control Hardware",
      email: "nusrat.jahan@ncdl-lab.org",
      bio: "Nusrat designs GaN-based motor drivers and the deterministic control loop that lets a spiking policy command a quadruped at 1 kHz. She leads the lab's hardware-in-the-loop testbed.",
      interests: ["Motor control", "Power electronics", "Legged robotics"],
      education: [
        { degree: "MSc, Mechatronics", institution: "BUET", year: "2022" },
        { degree: "BSc, EEE", institution: "CUET", year: "2019" },
      ],
      joinedYear: 2022,
      displayOrder: 4,
    },
    {
      slug: "arif-mahmud",
      name: "Arif Mahmud",
      category: "masters",
      designation: "MSc Student · Analog Front-Ends",
      email: "arif.mahmud@ncdl-lab.org",
      bio: "Arif is designing a 64-channel chopper-stabilised neural recording front-end targeting sub-10 µW per channel.",
      interests: ["Biopotential amplifiers", "Low-noise design"],
      education: [{ degree: "BSc, EEE", institution: "BUET", year: "2023" }],
      joinedYear: 2023,
      displayOrder: 1,
    },
    {
      slug: "farhana-akter",
      name: "Farhana Akter",
      category: "masters",
      designation: "MSc Student · FPGA Vision",
      email: "farhana.akter@ncdl-lab.org",
      bio: "Farhana implemented a streaming segmentation pipeline on Zynq that runs at 120 fps with under 4 ms latency.",
      interests: ["FPGA", "Image segmentation", "HLS"],
      education: [{ degree: "BSc, CSE", institution: "University of Dhaka", year: "2023" }],
      joinedYear: 2023,
      displayOrder: 2,
    },
    {
      slug: "rakib-hossain",
      name: "Md. Rakib Hossain",
      category: "masters",
      designation: "MSc Student · RF Design",
      email: "rakib.hossain@ncdl-lab.org",
      bio: "Rakib is characterising a 60 GHz LNA with a current-reuse topology for neuromorphic radar front-ends.",
      interests: ["mmWave LNAs", "Radar sensing"],
      education: [{ degree: "BSc, EEE", institution: "RUET", year: "2022" }],
      joinedYear: 2024,
      displayOrder: 3,
    },
    {
      slug: "linh-nguyen",
      name: "Linh Nguyen",
      category: "masters",
      designation: "MSc Student · Neuromorphic Sensing",
      email: "linh.nguyen@ncdl-lab.org",
      bio: "Linh is exploring spiking olfactory models and the gas-sensor interface circuits needed to drive them.",
      interests: ["Neuromorphic olfaction", "Sensor circuits"],
      education: [{ degree: "BEng, Electronics", institution: "Hanoi University of Science & Technology", year: "2023" }],
      joinedYear: 2024,
      displayOrder: 4,
    },
    {
      slug: "tahsin-ahmed",
      name: "Tahsin Ahmed",
      category: "masters",
      designation: "MSc Student · Robot Electronics",
      email: "tahsin.ahmed@ncdl-lab.org",
      bio: "Tahsin built the ROS 2 bridge and power stage for the lab's six-axis manipulator retrofit.",
      interests: ["ROS 2", "Power stages", "Embedded firmware"],
      education: [{ degree: "BSc, Mechatronics", institution: "IUT", year: "2023" }],
      joinedYear: 2024,
      displayOrder: 5,
    },
    {
      slug: "imran-chowdhury",
      name: "Imran Chowdhury",
      category: "alumni",
      designation: "PhD 2023",
      alumniPosition: "Postdoctoral Researcher, ETH Zürich",
      email: "imran.chowdhury@alumni.ncdl-lab.org",
      bio: "Imran's thesis established the lab's first multi-core spiking fabric. He now works on cryogenic electronics for quantum control at ETH Zürich.",
      interests: ["Cryogenic CMOS", "Spiking fabrics"],
      education: [{ degree: "PhD, Electrical Engineering", institution: "NCDL", year: "2023" }],
      scholarUrl: "https://scholar.google.com/",
      joinedYear: 2018,
      displayOrder: 1,
    },
    {
      slug: "priya-nair",
      name: "Priya Nair",
      category: "alumni",
      designation: "PhD 2022",
      alumniPosition: "Analog Design Engineer, Texas Instruments",
      bio: "Priya designed the lab's correlated-double-sampling SAR ADC and now works on precision signal-chain products.",
      interests: ["Data converters", "Precision analog"],
      education: [{ degree: "PhD, Microelectronics", institution: "NCDL", year: "2022" }],
      joinedYear: 2017,
      displayOrder: 2,
    },
    {
      slug: "sabbir-ahmed",
      name: "Sabbir Ahmed",
      category: "alumni",
      designation: "MSc 2024",
      alumniPosition: "PhD Student, TU Delft",
      bio: "Sabbir built the first FPGA prototype of the lab's event-routing fabric and continues the work in Delft.",
      interests: ["NoC", "FPGA prototyping"],
      education: [{ degree: "MSc, EEE", institution: "NCDL", year: "2024" }],
      joinedYear: 2022,
      displayOrder: 3,
    },
    {
      slug: "elena-petrova",
      name: "Elena Petrova",
      category: "alumni",
      designation: "PhD 2021",
      alumniPosition: "Assistant Professor, University of Zagreb",
      bio: "Elena led the memristor characterisation programme and now runs her own group on emerging memory devices.",
      interests: ["Memristors", "Emerging memory"],
      education: [{ degree: "PhD, Electronics", institution: "NCDL", year: "2021" }],
      joinedYear: 2016,
      displayOrder: 4,
    },
    {
      slug: "mahmudul-hasan",
      name: "Mahmudul Hasan",
      category: "alumni",
      designation: "MSc 2023",
      alumniPosition: "FPGA Engineer, AMD",
      bio: "Mahmudul developed the lab's connected-component labelling IP core, now used in industrial inspection products.",
      interests: ["RTL design", "Computer vision"],
      education: [{ degree: "MSc, CSE", institution: "NCDL", year: "2023" }],
      joinedYear: 2021,
      displayOrder: 5,
    },
  ]);

  for (const [slug, patch] of Object.entries(memberKorean)) {
    await db.update(members).set(patch).where(eq(members.slug, slug));
  }

  await db.insert(collaborations).values([
    {
      institution: "ETH Zürich",
      country: "Switzerland",
      description:
        "Joint work on cryogenic control electronics and shared tape-out of spiking test structures.",
      websiteUrl: "https://ethz.ch",
      displayOrder: 1,
    },
    {
      institution: "TU Delft",
      country: "Netherlands",
      description:
        "Co-supervision of doctoral students on event-based vision and network-on-chip verification.",
      websiteUrl: "https://tudelft.nl",
      displayOrder: 2,
    },
    {
      institution: "imec",
      country: "Belgium",
      description:
        "Access to advanced CMOS shuttles and memristive device stacks for synapse characterisation.",
      websiteUrl: "https://imec-int.com",
      displayOrder: 3,
    },
    {
      institution: "University of Tokyo",
      country: "Japan",
      description:
        "Exchange programme on neuromorphic robotics and event-driven motor control.",
      websiteUrl: "https://u-tokyo.ac.jp",
      displayOrder: 4,
    },
    {
      institution: "IIT Bombay",
      country: "India",
      description:
        "Shared benchmark suite for spiking inference accelerators and student exchange.",
      websiteUrl: "https://iitb.ac.in",
      displayOrder: 5,
    },
  ]);

  await db.insert(projects).values([
    {
      slug: "spiking-accelerator-28nm",
      title: "Spiking Neural Network Accelerator in 28 nm CMOS",
      areaId: areaId("neuromorphic-circuit-design"),
      status: "ongoing",
      summary:
        "A 16-core event-driven inference engine targeting 10⁹ synaptic events per second under 50 mW.",
      description:
        "This project integrates sixteen spiking cores with a hierarchical address-event fabric, a programmable synapse SRAM and an on-chip scheduler that balances load without a host processor. The design targets keyword spotting and gesture recognition workloads at always-on power levels.\n\nThe second silicon revision adds per-core dynamic voltage scaling and a measurement harness that streams activity counters off-chip for architecture-level validation.",
      funding: "University Research Grant · 2024–2027",
      collaborators: "imec, TU Delft",
      startYear: 2024,
      endYear: 2027,
      featured: true,
      displayOrder: 1,
    },
    {
      slug: "memristive-synapse-array",
      title: "Memristive Synapse Array with Drift-Compensated Learning",
      areaId: areaId("neuromorphic-circuit-design"),
      status: "ongoing",
      summary:
        "Characterising HfO₂ synapse arrays and closing a compensation loop that holds weights stable for 10⁶ update cycles.",
      description:
        "Conductance drift is the main obstacle to reliable on-chip learning with resistive memories. We characterise arrays across temperature and time, fit a compact drift model, and implement a feedback loop that periodically refreshes weights with minimal energy cost.\n\nThe prototype pairs a 64×64 array with a custom read-out ASIC and an FPGA-based training controller.",
      funding: "National Science Foundation · 2023–2026",
      collaborators: "imec",
      startYear: 2023,
      endYear: 2026,
      featured: true,
      displayOrder: 2,
    },
    {
      slug: "mmwave-lna-neuromorphic-radar",
      title: "Low-Power 60 GHz Front-End for Neuromorphic Radar",
      areaId: areaId("rf-analog-circuit-design"),
      status: "ongoing",
      summary:
        "A 60 GHz LNA–mixer chain with 4.2 dB noise figure and 18 mW consumption for event-driven radar sensing.",
      description:
        "Event-driven radar only converts samples when the scene changes, so the front-end dominates system power. This project develops a current-reuse LNA and a passive mixer that together hold noise figure below 4.5 dB while consuming under 20 mW.\n\nMeasurements are carried out on the lab's 67 GHz probe station with on-wafer calibration standards.",
      funding: "Industry Partnership · 2025–2027",
      collaborators: "University of Tokyo",
      startYear: 2025,
      endYear: 2027,
      featured: true,
      displayOrder: 3,
    },
    {
      slug: "fpga-edge-segmentation",
      title: "FPGA-Accelerated Real-Time Segmentation for Edge Robotics",
      areaId: areaId("fpga-circuit-and-image-analysis"),
      status: "completed",
      summary:
        "A streaming segmentation pipeline on Zynq-7020 with 3.8 ms latency and 2.4 W total board power.",
      description:
        "The project delivered a reusable RTL library for line buffering, separable filtering and connected-component labelling, composed into a segmentation pipeline for a mobile manipulator.\n\nThe design is fully deterministic: worst-case latency is bounded by construction, which let the robotics group certify the perception loop for safety-critical operation.",
      funding: "Teaching & Infrastructure Fund · 2022–2024",
      collaborators: "NCDL Robotics Group",
      startYear: 2022,
      endYear: 2024,
      featured: false,
      displayOrder: 4,
    },
    {
      slug: "event-vision-interface-asic",
      title: "Event-Driven Vision Sensor Interface ASIC",
      areaId: areaId("fpga-circuit-and-image-analysis"),
      status: "ongoing",
      summary:
        "A 1 µs-timestamp event interface that streams directly into the lab's spiking accelerator.",
      description:
        "Conventional frame-based interfaces throw away the temporal sparsity that makes event cameras efficient. This ASIC timestamps and packetises events at the sensor boundary, applies a configurable denoising filter, and delivers address-event packets to the accelerator without a host CPU in the loop.",
      funding: "University Research Grant · 2025–2028",
      collaborators: "TU Delft",
      startYear: 2025,
      endYear: 2028,
      featured: false,
      displayOrder: 5,
    },
    {
      slug: "quadruped-motor-control-ic",
      title: "Custom Motor Control Electronics for a Spiking Quadruped",
      areaId: areaId("robotics-control-circuit-design"),
      status: "completed",
      summary:
        "GaN-based drivers and a 1 kHz current loop that let a spiking policy walk a 12-DoF quadruped.",
      description:
        "We replaced a commercial actuator stack with custom four-layer boards: isolated GaN gate drivers, magnetic encoders with microsecond timestamping, and a Cortex-M7 running field-oriented control at 20 kHz.\n\nThe result cut actuator electronics mass by 42% and made the control loop deterministic enough to deploy spiking policies trained in simulation.",
      funding: "Robotics Initiative · 2021–2023",
      collaborators: "University of Tokyo",
      startYear: 2021,
      endYear: 2023,
      featured: false,
      displayOrder: 6,
    },
  ]);

  await db.insert(publications).values([
    {
      title: "A 16-Core Event-Driven Accelerator with Hierarchical Address-Event Routing",
      authors: "R. Karim, A. Rahman, I. Chowdhury",
      venue: "IEEE Journal of Solid-State Circuits",
      type: "journal",
      year: 2026,
      doi: "10.1109/JSSC.2026.3312045",
      url: "https://doi.org/10.1109/JSSC.2026.3312045",
      abstract:
        "A 28 nm spiking accelerator sustaining 1.1 × 10⁹ synaptic events per second at 47 mW, with a hierarchical router that bounds congestion without global arbitration.",
      areaId: areaId("neuromorphic-circuit-design"),
      featured: true,
    },
    {
      title: "Drift-Compensated Weight Refresh for HfO₂ Memristive Synapse Arrays",
      authors: "S. Islam, E. Petrova, A. Rahman",
      venue: "IEEE Transactions on Electron Devices",
      type: "journal",
      year: 2026,
      doi: "10.1109/TED.2026.3288110",
      url: "https://doi.org/10.1109/TED.2026.3288110",
      abstract:
        "A compact drift model and refresh schedule that holds classification accuracy within 1.4% over 10⁶ weight updates.",
      areaId: areaId("neuromorphic-circuit-design"),
      featured: true,
    },
    {
      title: "A 4.2 dB NF 60 GHz Current-Reuse LNA in 22 nm FDSOI",
      authors: "M. R. Hossain, M. Lindqvist",
      venue: "IEEE Transactions on Microwave Theory and Techniques",
      type: "journal",
      year: 2026,
      doi: "10.1109/TMTT.2026.3277004",
      url: "https://doi.org/10.1109/TMTT.2026.3277004",
      abstract:
        "A current-reuse cascode LNA achieving 4.2 dB noise figure and 19.6 dB gain at 18 mW, characterised on-wafer to 67 GHz.",
      areaId: areaId("rf-analog-circuit-design"),
    },
    {
      title: "Event-Triggered Radar Sensing for Always-On Edge Perception",
      authors: "M. Lindqvist, A. Rahman, W. Chen",
      venue: "IEEE Sensors Journal",
      type: "journal",
      year: 2025,
      doi: "10.1109/JSEN.2025.3145521",
      url: "https://doi.org/10.1109/JSEN.2025.3145521",
      abstract:
        "We show that change-driven sampling reduces radar front-end duty cycle by 87% with no loss in detection recall.",
      areaId: areaId("rf-analog-circuit-design"),
    },
    {
      title: "Streaming Segmentation on FPGA with Bounded Worst-Case Latency",
      authors: "F. Akter, M. Hasan, T. Hasan",
      venue: "IEEE Transactions on Circuits and Systems for Video Technology",
      type: "journal",
      year: 2025,
      doi: "10.1109/TCSVT.2025.3120908",
      url: "https://doi.org/10.1109/TCSVT.2025.3120908",
      abstract:
        "A fully streaming segmentation pipeline with a 3.8 ms worst-case latency bound and 2.4 W board power on Zynq-7020.",
      areaId: areaId("fpga-circuit-and-image-analysis"),
    },
    {
      title: "Sub-10 µW Chopper-Stabilised Front-End for 64-Channel Neural Recording",
      authors: "A. Mahmud, P. Nair, A. Rahman",
      venue: "IEEE Transactions on Biomedical Circuits and Systems",
      type: "journal",
      year: 2025,
      doi: "10.1109/TBCAS.2025.3098842",
      url: "https://doi.org/10.1109/TBCAS.2025.3098842",
      abstract:
        "A 9.3 µW per-channel recording front-end with 1.7 µVrms input-referred noise over a 10 kHz bandwidth.",
      areaId: areaId("rf-analog-circuit-design"),
    },
    {
      title: "Deterministic 1 kHz Current Control for Spiking Locomotion Policies",
      authors: "N. Jahan, T. Ahmed, A. Rahman",
      venue: "IEEE/ASME Transactions on Mechatronics",
      type: "journal",
      year: 2024,
      doi: "10.1109/TMECH.2024.3421177",
      url: "https://doi.org/10.1109/TMECH.2024.3421177",
      abstract:
        "Custom GaN drivers and a real-time loop that executes spiking locomotion policies without a jitter-induced gait failure.",
      areaId: areaId("robotics-control-circuit-design"),
    },
    {
      title: "Compact Modelling of Conductance Drift in Resistive Synapses",
      authors: "E. Petrova, S. Islam, A. Rahman",
      venue: "IEEE Transactions on Nanotechnology",
      type: "journal",
      year: 2024,
      doi: "10.1109/TNANO.2024.3389915",
      url: "https://doi.org/10.1109/TNANO.2024.3389915",
      abstract:
        "A three-parameter drift model fitted across 300 devices and four temperatures, validated in a closed-loop training experiment.",
      areaId: areaId("neuromorphic-circuit-design"),
    },
    {
      title: "A 1 µs Timestamping Interface for Event Cameras",
      authors: "W. Chen, T. Hasan",
      venue: "IEEE Sensors Journal",
      type: "journal",
      year: 2024,
      doi: "10.1109/JSEN.2024.3354478",
      url: "https://doi.org/10.1109/JSEN.2024.3354478",
      abstract:
        "An interface ASIC that preserves event timing to within 1 µs while reducing packet overhead by 62%.",
      areaId: areaId("fpga-circuit-and-image-analysis"),
    },
    {
      title: "Hierarchical Address-Event Routing Without Global Arbitration",
      authors: "R. Karim, I. Chowdhury, A. Rahman",
      venue: "IEEE International Symposium on Circuits and Systems (ISCAS)",
      type: "conference",
      year: 2026,
      doi: "10.1109/ISCAS.2026.10942211",
      url: "https://doi.org/10.1109/ISCAS.2026.10942211",
      abstract:
        "A congestion-aware router that bounds worst-case event latency in a 16-core spiking fabric.",
      areaId: areaId("neuromorphic-circuit-design"),
      featured: true,
    },
    {
      title: "On-Chip Learning with Drift-Aware Synaptic Refresh",
      authors: "S. Islam, A. Rahman",
      venue: "IEEE International Electron Devices Meeting (IEDM)",
      type: "conference",
      year: 2025,
      doi: "10.1109/IEDM.2025.10884422",
      url: "https://doi.org/10.1109/IEDM.2025.10884422",
      abstract:
        "We demonstrate in-situ learning on a 64×64 memristive array with a refresh policy that costs 3.1% of training energy.",
      areaId: areaId("neuromorphic-circuit-design"),
    },
    {
      title: "Event-Driven Vision Pipeline on a Heterogeneous SoC",
      authors: "W. Chen, F. Akter, T. Hasan",
      venue: "ACM/SIGDA International Symposium on Field-Programmable Gate Arrays (FPGA)",
      type: "conference",
      year: 2025,
      doi: "10.1145/3629450.3648811",
      url: "https://doi.org/10.1145/3629450.3648811",
      abstract:
        "Coupling an event interface ASIC with an FPGA classifier to achieve 1.2 mJ per inference.",
      areaId: areaId("fpga-circuit-and-image-analysis"),
    },
    {
      title: "A 67 GHz Characterisation Methodology for Neuromorphic Radar Front-Ends",
      authors: "M. Lindqvist, M. R. Hossain",
      venue: "European Microwave Conference (EuMC)",
      type: "conference",
      year: 2025,
      doi: "10.23919/EuMC.2025.10788331",
      url: "https://doi.org/10.23919/EuMC.2025.10788331",
      abstract:
        "A calibration and de-embedding procedure that reduces on-wafer measurement uncertainty to 0.15 dB at 60 GHz.",
      areaId: areaId("rf-analog-circuit-design"),
    },
    {
      title: "Hardware-in-the-Loop Validation of Spiking Locomotion Controllers",
      authors: "N. Jahan, T. Ahmed",
      venue: "IEEE International Conference on Robotics and Automation (ICRA)",
      type: "conference",
      year: 2024,
      doi: "10.1109/ICRA.2024.10611223",
      url: "https://doi.org/10.1109/ICRA.2024.10611223",
      abstract:
        "A testbed that injects realistic actuator delay into spiking policies before deployment on a 12-DoF quadruped.",
      areaId: areaId("robotics-control-circuit-design"),
    },
    {
      title: "Reusable RTL Blocks for Streaming Image Processing",
      authors: "M. Hasan, T. Hasan",
      venue: "IEEE International Symposium on Circuits and Systems (ISCAS)",
      type: "conference",
      year: 2024,
      doi: "10.1109/ISCAS.2024.10558812",
      url: "https://doi.org/10.1109/ISCAS.2024.10558812",
      abstract:
        "An open library of verified streaming vision blocks with formal latency guarantees.",
      areaId: areaId("fpga-circuit-and-image-analysis"),
    },
    {
      title: "A 12-bit SAR ADC with Correlated Double Sampling for Neural Interfaces",
      authors: "P. Nair, A. Rahman",
      venue: "IEEE Asian Solid-State Circuits Conference (A-SSCC)",
      type: "conference",
      year: 2023,
      doi: "10.1109/A-SSCC.2023.10344611",
      url: "https://doi.org/10.1109/A-SSCC.2023.10344611",
      abstract:
        "A 12-bit, 250 kS/s SAR ADC drawing 6.8 µW with correlated double sampling for offset cancellation.",
      areaId: areaId("rf-analog-circuit-design"),
    },
    {
      title: "NCDL-SPARK: A 16-Core Spiking Inference SoC",
      authors: "A. Rahman, R. Karim, I. Chowdhury, S. Islam",
      venue: "Silicon verified at TSMC 28 nm · die area 9.4 mm²",
      type: "chip",
      year: 2026,
      doi: null,
      url: null,
      abstract:
        "Sixteenth-generation test chip: 16 spiking cores, 4 MB synapse SRAM, hierarchical event router, on-chip activity counters. 47 mW at 1.1 × 10⁹ events/s.",
      areaId: areaId("neuromorphic-circuit-design"),
      featured: true,
    },
    {
      title: "NCDL-ADC12: Low-Power SAR Converter Macro",
      authors: "P. Nair, A. Rahman",
      venue: "Silicon verified at GF 22 nm FDX · die area 0.36 mm²",
      type: "chip",
      year: 2023,
      doi: null,
      url: null,
      abstract:
        "12-bit 250 kS/s SAR ADC macro with integrated reference buffer, 6.8 µW total consumption, used in three subsequent designs.",
      areaId: areaId("rf-analog-circuit-design"),
    },
    {
      title: "Winter School on Neuromorphic Hardware Design (5th edition)",
      authors: "NCDL Organising Committee",
      venue: "Five-day workshop · 84 participants from 11 countries",
      type: "workshop",
      year: 2025,
      doi: null,
      url: null,
      abstract:
        "Hands-on sessions on spiking neuron circuits, event-driven routing and FPGA prototyping, with a tape-out-ready reference design as the final exercise.",
      areaId: null,
    },
    {
      title: "mmWave Measurement Workshop for Graduate Students",
      authors: "M. Lindqvist, NCDL",
      venue: "Three-day workshop · on-wafer calibration and noise characterisation",
      type: "workshop",
      year: 2024,
      doi: null,
      url: null,
      abstract:
        "Practical training on the 67 GHz probe station covering SOLT calibration, de-embedding and noise-figure measurement.",
      areaId: areaId("rf-analog-circuit-design"),
    },
    {
      title: "Best Paper Award — IEEE ISCAS 2026",
      authors: "R. Karim, I. Chowdhury, A. Rahman",
      venue: "IEEE International Symposium on Circuits and Systems",
      type: "certificate",
      year: 2026,
      doi: null,
      url: null,
      abstract:
        "Awarded for \"Hierarchical Address-Event Routing Without Global Arbitration\" in the Neural Systems track.",
      areaId: areaId("neuromorphic-circuit-design"),
    },
    {
      title: "Outstanding Student Design Award — A-SSCC 2023",
      authors: "P. Nair",
      venue: "IEEE Asian Solid-State Circuits Conference",
      type: "certificate",
      year: 2023,
      doi: null,
      url: null,
      abstract:
        "Recognised for the 12-bit SAR ADC with correlated double sampling in the student design contest.",
      areaId: areaId("rf-analog-circuit-design"),
    },
  ]);

  for (const [title, patch] of Object.entries(publicationKorean)) {
    await db.update(publications).set(patch).where(eq(publications.title, title));
  }

  // Certificate artwork for the publications gallery.
  await db
    .update(publications)
    .set({ imageUrl: "/images/lab/die.svg" })
    .where(eq(publications.type, "certificate"));

  await db.insert(news).values([
    {
      slug: "ncdl-spark-tapeout-returns",
      title: "NCDL-SPARK test chips return from the 28 nm shuttle",
      excerpt:
        "Sixteen spiking cores, 4 MB of synapse SRAM and the hierarchical event router all come up on first silicon.",
      content:
        "The lab's sixteenth test chip, NCDL-SPARK, returned from the foundry this week and passed bring-up on the first attempt. The die integrates sixteen spiking cores, 4 MB of synapse SRAM and the hierarchical address-event router developed by Rezaul Karim's group.\n\nInitial measurements show 1.1 × 10⁹ synaptic events per second at 47 mW, slightly better than the pre-layout estimate. On-chip activity counters stream over a 1 Gb/s serial link, so the full keyword-spotting benchmark can now be characterised in a single afternoon rather than a week of bench work.\n\nThe team will present detailed results at ISCAS in May. A full characterisation report and the measurement scripts will be released alongside the paper.",
      imageUrl: "/images/lab/die.svg",
      authorName: "Rezaul Karim",
      publishedAt: new Date("2026-10-22T09:00:00Z"),
    },
    {
      slug: "best-paper-award-iscas-2026",
      title: "Best Paper Award at IEEE ISCAS 2026",
      excerpt:
        "Our work on congestion-aware event routing received the Best Paper Award in the Neural Systems and Applications track.",
      content:
        "Rezaul Karim, Imran Chowdhury and Ayesha Rahman received the Best Paper Award at IEEE ISCAS 2026 for \"Hierarchical Address-Event Routing Without Global Arbitration\".\n\nThe paper introduces a router that bounds worst-case event latency in a multi-core spiking fabric without a central arbiter — a bottleneck that has limited scaling in previous generations.\n\nCongratulations to the whole silicon team, and to the reviewers who pushed us to demonstrate the bound formally rather than empirically.",
      imageUrl: "/images/lab/wafer.svg",
      authorName: "NCDL Communications",
      publishedAt: new Date("2026-09-14T10:30:00Z"),
    },
    {
      slug: "winter-school-2026-announced",
      title: "Winter School on Neuromorphic Hardware Design returns in January",
      excerpt:
        "Five days of hands-on circuit design, routing and FPGA prototyping, with scholarships for students from developing countries.",
      content:
        "The sixth edition of our Winter School will run from 12–16 January 2027 at the NCDL building. The programme covers spiking neuron circuits, event-driven routing, synapse device characterisation and FPGA prototyping, ending with a tape-out-ready reference design.\n\nEighty-four participants from eleven countries joined last year. We are again offering ten full scholarships covering travel and accommodation for students from developing countries, funded by our industry partners.\n\nApplications close on 30 November. Prospective participants should send a short CV and a one-paragraph statement of interest through the contact page.",
      imageUrl: "/images/lab/neural.svg",
      authorName: "NCDL Communications",
      publishedAt: new Date("2026-08-30T08:00:00Z"),
    },
    {
      slug: "memristor-array-milestone",
      title: "Memristive array reaches one million stable weight updates",
      excerpt:
        "Sadia Islam's drift-compensation loop holds classification accuracy within 1.4% across 10⁶ updates.",
      content:
        "After eleven months of continuous operation, the lab's 64×64 HfO₂ synapse array has completed one million weight updates with the drift-compensation loop active. Accuracy on the MNIST-derived benchmark stayed within 1.4% of the freshly programmed baseline.\n\nThe result, accepted for publication in IEEE Transactions on Electron Devices, is the first demonstration of long-horizon stability in our arrays and removes a key objection to analog on-chip learning at this scale.\n\nThe next step is to integrate the refresh controller directly into the read-out ASIC, removing the FPGA from the loop entirely.",
      imageUrl: "/images/lab/wafer.svg",
      authorName: "Sadia Islam",
      publishedAt: new Date("2026-07-08T11:15:00Z"),
    },
    {
      slug: "quadruped-field-trial",
      title: "Spiking quadruped completes a 2 km autonomous field trial",
      excerpt:
        "The custom motor-control stack ran for 94 minutes on a single battery charge over uneven terrain.",
      content:
        "Nusrat Jahan's spiking locomotion controller completed a 2 km autonomous traverse of the campus perimeter last month. The robot walked for 94 minutes on one battery charge, with the custom GaN driver boards reporting a peak junction temperature of 68 °C.\n\nThe trial was designed to stress the deterministic control loop: the route includes two steep ramps, gravel and a section of polished stone. No gait failures were recorded, and the event log shows a worst-case control-loop jitter of 11 µs.\n\nVideo and the full telemetry log are available from the robotics group on request.",
      imageUrl: "/images/lab/pcb.svg",
      authorName: "Nusrat Jahan",
      publishedAt: new Date("2026-06-19T14:00:00Z"),
    },
    {
      slug: "imec-collaboration-renewed",
      title: "Research collaboration with imec renewed for three years",
      excerpt:
        "Continued access to advanced CMOS shuttles and memristive device stacks will support the next two silicon generations.",
      content:
        "NCDL and imec have renewed their research collaboration for a further three years. The agreement gives the lab access to advanced CMOS shuttle runs and to memristive device stacks for synapse characterisation.\n\nThe renewal also funds two joint doctoral positions, one based in Leuven and one in Dhaka, with students spending at least six months at each site.\n\nWe thank our colleagues at imec for a decade of productive collaboration and look forward to the next generation of test chips.",
      imageUrl: "/images/lab/scope.svg",
      authorName: "Ayesha Rahman",
      publishedAt: new Date("2026-05-04T09:45:00Z"),
    },
  ]);

  // Photo galleries shown on the news detail pages.
  const newsGalleries: Record<string, string[]> = {
    "ncdl-spark-tapeout-returns": [
      "/images/lab/die.svg",
      "/images/lab/wafer.svg",
      "/images/lab/scope.svg",
    ],
    "best-paper-award-iscas-2026": ["/images/lab/wafer.svg", "/images/lab/neural.svg"],
    "winter-school-2026-announced": ["/images/lab/neural.svg", "/images/lab/pcb.svg"],
    "memristor-array-milestone": ["/images/lab/wafer.svg", "/images/lab/die.svg"],
    "quadruped-field-trial": ["/images/lab/pcb.svg", "/images/lab/scope.svg"],
    "imec-collaboration-renewed": ["/images/lab/scope.svg", "/images/lab/die.svg"],
  };

  for (const [slug, images] of Object.entries(newsGalleries)) {
    await db.update(news).set({ images }).where(eq(news.slug, slug));
  }

  for (const [slug, patch] of Object.entries(newsKorean)) {
    await db.update(news).set(patch).where(eq(news.slug, slug));
  }

  await db.insert(positions).values([
    {
      title: "PhD position — Spiking accelerator architecture",
      type: "phd",
      description:
        "Design and tape out the next generation of our event-driven inference fabric, with a focus on scalable routing and on-chip learning support.",
      requirements: [
        "MSc in electrical engineering, computer engineering or a related field",
        "Strong digital design skills (SystemVerilog, synthesis flow)",
        "Python for modelling and verification",
        "Prior silicon or FPGA prototyping experience is an advantage",
      ],
      fundingNote: "Fully funded for four years, including tuition and a monthly stipend.",
      deadline: "2027-01-15",
      isOpen: true,
      displayOrder: 1,
    },
    {
      title: "PhD position — Analog front-ends for neural interfaces",
      type: "phd",
      description:
        "Develop sub-10 µW recording front-ends and their data converters, from schematic to measured silicon on our 22 nm shuttle runs.",
      requirements: [
        "MSc in microelectronics or analog IC design",
        "Cadence Virtuoso and Spectre experience",
        "Understanding of noise analysis and offset cancellation",
        "Evidence of independent tape-out or measurement work",
      ],
      fundingNote: "Fully funded for four years; measurement travel supported.",
      deadline: "2027-02-01",
      isOpen: true,
      displayOrder: 2,
    },
    {
      title: "Research Assistant — FPGA vision pipelines",
      type: "research-assistant",
      description:
        "Build and verify streaming image-processing pipelines for our industrial inspection partners, working alongside the RTL library team.",
      requirements: [
        "BSc or MSc in EEE, CSE or equivalent",
        "SystemVerilog and Vivado/Vitis experience",
        "Comfort with Linux and Python tooling",
      ],
      fundingNote: "12-month contract, renewable, with conference travel.",
      deadline: "2026-12-10",
      isOpen: true,
      displayOrder: 3,
    },
    {
      title: "MSc thesis projects — rolling intake",
      type: "masters",
      description:
        "We supervise MSc theses across all four research areas. Current topics include drift-aware training circuits, event-based radar and GaN motor drives.",
      requirements: [
        "Enrolled in an MSc programme in a relevant discipline",
        "Completed coursework in analog or digital IC design",
        "Ability to commit at least 20 hours per week in the lab",
      ],
      fundingNote: "Partial scholarships available for outstanding candidates.",
      deadline: null,
      isOpen: true,
      displayOrder: 4,
    },
    {
      title: "Summer internship — silicon bring-up",
      type: "internship",
      description:
        "A twelve-week paid internship supporting the bring-up and characterisation of our next test chip.",
      requirements: [
        "Penultimate-year undergraduate in EEE or CSE",
        "Basic lab instrumentation experience",
      ],
      fundingNote: "Paid internship; on-campus accommodation provided.",
      deadline: "2026-04-30",
      isOpen: false,
      displayOrder: 5,
    },
  ]);

  for (const [title, patch] of Object.entries(positionKorean)) {
    await db.update(positions).set(patch).where(eq(positions.title, title));
  }

  await db.insert(gallery).values([
    {
      title: "NCDL-SPARK die",
      caption: "The NCDL-SPARK 28 nm test chip under the microscope — sixteen spiking cores and 4 MB of synapse SRAM.",
      imageUrl: "/images/lab/die.svg",
      displayOrder: 1,
    },
    {
      title: "Wafer characterisation",
      caption: "On-wafer probing during the bring-up campaign for the event-vision interface ASIC.",
      imageUrl: "/images/lab/wafer.svg",
      displayOrder: 2,
    },
    {
      title: "Event-driven network",
      caption: "Activity map from the hierarchical address-event router during a keyword-spotting benchmark.",
      imageUrl: "/images/lab/neural.svg",
      displayOrder: 3,
    },
    {
      title: "Measurement bench",
      caption: "67 GHz probe station used for noise-figure and phase-noise characterisation of our RF front-ends.",
      imageUrl: "/images/lab/scope.svg",
      displayOrder: 4,
    },
    {
      title: "Motor control board",
      caption: "Custom GaN driver board for the spiking quadruped, developed by the robotics hardware group.",
      imageUrl: "/images/lab/pcb.svg",
      displayOrder: 5,
    },
  ]);

  console.log("Seed complete.");
  console.log("  admin@ncdl-lab.org / admin1234");
  console.log("  faculty@ncdl-lab.org / faculty1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
