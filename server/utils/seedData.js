const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const ForumPost = require('../models/ForumPost');

dotenv.config();

const runSeedLogic = async () => {
  // 1. Clear All Collections
  await User.deleteMany({});
  await Course.deleteMany({});
  await Module.deleteMany({});
  await Quiz.deleteMany({});
  await Progress.deleteMany({});
  await ForumPost.deleteMany({});
  console.log('[Seed Script] Cleared all existing collection records completely');

  // 2. Seed Strictly 3 Official Users
  const adminUser = await User.create({
    name: 'Humanity First Admin',
    email: 'admin@humanityfirst.org',
    password: 'password123',
    role: 'admin',
    preferredLanguage: 'EN'
  });

  const trainerUser = await User.create({
    name: 'Shyam Phad',
    email: 'shyamphad03@gmail.com',
    password: 'password123',
    role: 'trainer',
    preferredLanguage: 'EN'
  });

  const volunteerUser = await User.create({
    name: 'Priya Sharma',
    email: 'volunteer@humanityfirst.org',
    password: 'password123',
    role: 'volunteer',
    preferredLanguage: 'HI'
  });

  console.log('[Seed Script] Seeded 3 official users: Admin, Trainer Shyam Phad, Volunteer Priya Sharma');

  // 3. Seed 1 Main Course
  const course = await Course.create({
    title: 'NGO Volunteer Orientation & Field Readiness Program',
    description: 'A comprehensive 8-module orientation curriculum designed to equip social sector volunteers and field staff with essential humanitarian values, safeguarding policies, field safety protocols, and emergency response skills.',
    category: 'Orientation',
    isPublished: true,
    createdBy: trainerUser._id,
    modules: []
  });

  // 4. Seed 8 NGO Modules
  const modulesSpecification = [
    {
      number: '01',
      type: 'Orientation',
      title: 'Introduction to Non-Profit Work & Volunteer Ethics',
      description: 'Explore the foundational role of non-profit organizations, volunteer ethics, boundary setting, and how community action creates sustainable social impact.',
      durationMinutes: 12,
      youtubeUrl: 'https://www.youtube.com/embed/YpSUp_4d_j4',
      keyTakeaways: [
        'Understand volunteer boundaries and professional accountability',
        'Recognize non-profit organizational structures',
        'Apply ethical decision-making in community service'
      ],
      fullContent: `
### SECTION 1: THE ROLE OF NON-PROFIT ORGANIZATIONS
Non-profit organizations and Non-Governmental Organizations (NGOs) serve as critical bridges between government public services and vulnerable civil society groups. As a volunteer or field representative of Humanity First Learning Hub, your actions directly reflect the mission and integrity of our global humanitarian network.

### SECTION 2: PROFESSIONAL BOUNDARIES & ETHICAL COMMITMENTS
When working in community service, maintaining clear professional and personal boundaries is essential:
1. **Zero Financial Exploitation:** Never solicit, demand, or accept personal monetary tips, gifts, or favors from community members receiving aid.
2. **Confidentiality:** Protect beneficiary privacy. Never share beneficiary names, medical conditions, or family hardship stories on personal social media channels without explicit written NGO authorization.
3. **Respect for Local Authority:** Coordinate all field visits through designated NGO leads and local community elders to ensure harmony and respect for local customs.

### SECTION 3: ETHICAL DECISION-MAKING MATRIX
When confronted with complex situations in the field:
- **Identify the Core Need:** Assess whether an action serves beneficiary safety and dignity.
- **Consult Team Leads:** Never make unilateral promises regarding funding, resource allocation, or permanent policy changes.
- **Document & Escalate:** Report any observed ethical violations or conflicts of interest immediately to your team supervisor.
      `.trim(),
      quizQuestions: [
        {
          questionText: 'What is a core ethical boundary for NGO volunteers in field operations?',
          options: [
            'Accepting monetary tips from beneficiaries',
            'Maintaining strict professional neutrality and non-exploitation',
            'Sharing personal contact details publicly',
            'Making policy promises on behalf of leadership'
          ],
          correctOptionIndex: 1,
          explanation: 'Professional neutrality and non-exploitation preserve beneficiary dignity and organizational integrity.'
        },
        {
          questionText: 'Why are clear organizational structures essential in non-profit relief operations?',
          options: [
            'To increase bureaucratic delay',
            'To ensure rapid escalation, accountability, and coordinated field action',
            'To limit volunteer participation',
            'To restrict field communication'
          ],
          correctOptionIndex: 1,
          explanation: 'Clear structures ensure swift escalation and coordinated disaster response.'
        },
        {
          questionText: 'How should volunteers approach ethical dilemmas in community service?',
          options: [
            'Decide independently without reporting',
            'Consult team supervisors and follow standard NGO operational guidelines',
            'Ignore minor infractions',
            'Delegate responsibility to community members'
          ],
          correctOptionIndex: 1,
          explanation: 'Escalating dilemmas to team leads ensures compliance with safeguarding protocols.'
        },
        {
          questionText: 'Which of the following actions violates beneficiary privacy policies?',
          options: [
            'Logging anonymized attendance numbers',
            'Posting un-consented photos of vulnerable children on personal social media',
            'Submitting internal field logs to the team supervisor',
            'Filing encrypted beneficiary registration forms'
          ],
          correctOptionIndex: 1,
          explanation: 'Posting photos without explicit consent violates beneficiary privacy rights.'
        },
        {
          questionText: 'What should a volunteer do if offered a personal gift by an aid recipient?',
          options: [
            'Politely decline explaining NGO policy against personal gifts',
            'Accept the gift to avoid offense and keep it privately',
            'Demand a larger gift',
            'Trade NGO aid items for the gift'
          ],
          correctOptionIndex: 0,
          explanation: 'Politely declining gifts aligns with the non-exploitation code of conduct.'
        }
      ]
    },
    {
      number: '02',
      type: 'Culture',
      title: 'Humanitarian Principles & Core Quality Standards',
      description: 'Learn the four core humanitarian principles—Humanity, Neutrality, Impartiality, and Independence—that guide all field operations and relief work.',
      durationMinutes: 15,
      youtubeUrl: 'https://www.youtube.com/embed/9X5zI7c3f3Y',
      keyTakeaways: [
        'Master the 4 core humanitarian principles',
        'Understand non-discriminatory aid distribution',
        'Maintain neutrality during field interventions'
      ],
      fullContent: `
### SECTION 1: THE FOUR PILLARS OF HUMANITARIAN ACTION
Humanitarian action is governed by four universally recognized international principles established by the United Nations General Assembly:

1. **HUMANITY:** Human suffering must be addressed wherever it is found. The purpose of humanitarian action is to protect life, health, and ensure respect for all human beings.
2. **IMPARTIALITY:** Aid must be given strictly on the basis of need, without discrimination based on nationality, race, religious beliefs, gender, class, or political opinions.
3. **NEUTRALITY:** Humanitarian actors must not take sides in hostilities or engage in controversies of a political, racial, religious, or ideological nature.
4. **INDEPENDENCE:** Humanitarian action must be autonomous from political, economic, military, or strategic objectives held by any actor in the operational area.

### SECTION 2: SPHERE STANDARDS & QUALITY COMMITMENTS
Field operations adhere to the **Sphere Handbook Core Standards**:
- **Water & Sanitation:** Minimum 15 liters of clean water per person per day during emergency relief camps.
- **Food Security:** Ensuring nutritional requirements (2,100 kcal/person/day) with cultural sensitivity.
- **Shelter & Non-Food Items:** Providing adequate covered living space (3.5 m² per person) protecting against extreme weather.
      `.trim(),
      quizQuestions: [
        {
          questionText: 'Which humanitarian principle dictates that aid must be given solely based on need without discrimination?',
          options: ['Neutrality', 'Impartiality', 'Independence', 'Monetization'],
          correctOptionIndex: 1,
          explanation: 'Impartiality requires aid distribution based strictly on objective need regardless of race or creed.'
        },
        {
          questionText: 'What does the principle of Neutrality require from field responders?',
          options: [
            'Taking political sides during local disputes',
            'Refraining from engaging in controversies or taking political/ideological sides',
            'Favoring specific local groups',
            'Publicly debating regional politics'
          ],
          correctOptionIndex: 1,
          explanation: 'Neutrality ensures responders maintain access and trust among all affected populations.'
        },
        {
          questionText: 'Independence in humanitarian response means:',
          options: [
            'Operating completely separate from safety guidelines',
            'Humanitarian action must be autonomous from political or economic objectives',
            'Working without supervisor oversight',
            'Funding operations through commercial sales'
          ],
          correctOptionIndex: 1,
          explanation: 'Humanitarian goals must remain uncompromised by external political agendas.'
        },
        {
          questionText: 'According to Sphere minimum standards, what is the target water allocation per person per day in emergency relief?',
          options: ['5 Liters', '15 Liters', '50 Liters', '100 Liters'],
          correctOptionIndex: 1,
          explanation: 'Sphere standards benchmark 15 liters per person per day for drinking, cooking, and hygiene.'
        },
        {
          questionText: 'The core purpose of the principle of Humanity is to:',
          options: [
            'Generate commercial profit',
            'Protect life, health, and ensure respect for all human beings',
            'Promote specific political parties',
            'Expand corporate brand awareness'
          ],
          correctOptionIndex: 1,
          explanation: 'Humanity prioritizes relieving suffering and affirming human dignity everywhere.'
        }
      ]
    },
    {
      number: '03',
      type: 'Field Readiness',
      title: 'Field Safety, Risk Assessment & Situational Awareness',
      description: 'Practical guidelines for maintaining personal safety, conducting field risk assessments, managing local threats, and reporting incidents during remote deployments.',
      durationMinutes: 18,
      youtubeUrl: 'https://www.youtube.com/embed/e1kIqL68XjE',
      keyTakeaways: [
        'Identify potential environmental and social hazards',
        'Establish secure team communication protocols',
        'Execute emergency evacuation procedures'
      ],
      fullContent: `
### SECTION 1: FIELD RISK ASSESSMENT PROTOCOL
Before entering any field deployment zone, all team leads and volunteers must complete a 3-step threat analysis:
1. **Environmental Threat Matrix:** Evaluate weather forecasts, road conditions, flood levels, and landslide risks.
2. **Social & Security Climate:** Monitor local news and consult community liaisons regarding civil unrest or active curfews.
3. **Infrastructure Verification:** Confirm mobile signal coverage, primary and secondary emergency evacuation routes, and nearest medical facility locations.

### SECTION 2: TEAM SAFETY RULES IN REMOTE AREAS
- **Buddy System:** Never travel alone in remote or volatile zones. Always work in pairs of two or more.
- **Communications Check:** Test satellite or cellular radios every 2 hours with central dispatch.
- **Go-Bag Readiness:** Maintain a pre-packed 72-hour personal survival kit containing water purification, flashlight, first aid, emergency blanket, and official credentials.
      `.trim(),
      quizQuestions: [
        {
          questionText: 'What is the first step when arriving at a high-risk field deployment location?',
          options: [
            'Begin distribution immediately',
            'Conduct a 360-degree environmental risk assessment and verify emergency exit routes',
            'Separate from team members',
            'Disable GPS tracking'
          ],
          correctOptionIndex: 1,
          explanation: 'Situational risk assessment identifies hazards before engaging in field activities.'
        },
        {
          questionText: 'How frequently should team check-ins occur during remote field operations?',
          options: [
            'Once every week',
            'According to pre-established communication schedules with dispatch',
            'Only when an emergency occurs',
            'Never'
          ],
          correctOptionIndex: 1,
          explanation: 'Regular communication check-ins ensure prompt response if a team member is unaccounted for.'
        },
        {
          questionText: 'If a field location becomes volatile or unsafe, team members should:',
          options: [
            'Argue with local agitators',
            'Initiate immediate de-escalation/evacuation protocols as instructed by field leads',
            'Continue work independently',
            'Hide equipment and stay silent'
          ],
          correctOptionIndex: 1,
          explanation: 'Personnel safety is paramount; evacuation protocols take priority over material assets.'
        },
        {
          questionText: 'What is the "Buddy System" requirement during field deployments?',
          options: [
            'Working with a companion at all times and never traveling alone in remote zones',
            'Sharing personal expenses with teammates',
            'Wearing matching uniforms',
            'Assigning tasks to community members'
          ],
          correctOptionIndex: 0,
          explanation: 'The Buddy System ensures immediate assistance if one team member encounters danger.'
        },
        {
          questionText: 'What key item must be inside every volunteer field Go-Bag?',
          options: ['Excessive personal clothing', 'Water purification, first aid kit, flashlight, and official ID', 'Unnecessary heavy tools', 'Commercial merchandise'],
          correctOptionIndex: 1,
          explanation: 'Go-Bags contain essential emergency survival and identification tools.'
        }
      ]
    },
    {
      number: '04',
      type: 'Mandatory • 80% pass',
      title: 'Child Safeguarding & Protection Protocols',
      description: 'Mandatory policy module outlining zero-tolerance guidelines for child abuse, exploitation, consent protocols, and mandatory incident reporting mechanisms.',
      durationMinutes: 20,
      youtubeUrl: 'https://www.youtube.com/embed/4yA72nN9b10',
      keyTakeaways: [
        'Recognize signs of child distress and abuse',
        'Enforce strict photo/video consent guidelines',
        'Follow mandatory 24-hour incident escalation protocols'
      ],
      fullContent: `
### SECTION 1: MANDATORY CHILD SAFEGUARDING POLICY
Humanity First maintains a strict **ZERO-TOLERANCE POLICY** for child abuse, exploitation, or neglect. All staff, contractors, and volunteers are bound by this policy during and outside working hours.

### SECTION 2: CORE CODE OF CONDUCT FOR CHILD INTERACTION
- **Never Be Alone With a Child:** All interactions with children must take place in open, visible, public settings with another adult present.
- **Physical Contact:** Keep physical contact appropriate and child-initiated (e.g., high-fives or handshakes). Never engage in rough play or culturally inappropriate physical contact.
- **Photography & Media:** NEVER photograph or record children without written, signed consent from a parent or legal guardian. Never publish images that reveal full names, exact home addresses, or vulnerable circumstances.

### SECTION 3: INCIDENT REPORTING PROCEDURE
If you witness, suspect, or receive a disclosure of child abuse:
1. **Ensure Immediate Safety:** Protect the child from ongoing harm without placing yourself in danger.
2. **Listen Without Judgment:** Do not interrogate or make false promises of secrecy.
3. **Report Within 24 Hours:** Immediately complete an official Safeguarding Incident Form and submit it to the Designated Safeguarding Focal Point (DSFP).
      `.trim(),
      quizQuestions: [
        {
          questionText: 'What is the mandatory escalation window for reporting a suspected child safeguarding breach?',
          options: ['Within 72 hours', 'Immediately / Within 24 hours', 'At the end of the month', 'Within 14 days'],
          correctOptionIndex: 1,
          explanation: 'Child safeguarding concerns must be reported immediately or within 24 hours.'
        },
        {
          questionText: 'When photographing beneficiaries for grant documentation, what is strictly required?',
          options: [
            'No consent needed if outdoors',
            'Explicit, documented consent from guardians upholding individual dignity',
            'Verbal consent from bystanders',
            'Only photographing from behind'
          ],
          correctOptionIndex: 1,
          explanation: 'Dignity policies mandate written or explicit consent for all media.'
        },
        {
          questionText: 'Humanity First maintains what policy regarding child exploitation or abuse?',
          options: ['Conditional warnings', 'Zero tolerance policy with immediate dismissal and legal reporting', 'Internal mediation', 'Fines'],
          correctOptionIndex: 1,
          explanation: 'Zero tolerance applies across all field operations globally.'
        },
        {
          questionText: 'Where should volunteer interactions with children take place?',
          options: ['In private closed rooms', 'In open, visible, public settings with another adult present', 'In personal vehicles', 'Outside field operational areas'],
          correctOptionIndex: 1,
          explanation: 'Visible public settings protect children and volunteers from misconduct or false accusations.'
        },
        {
          questionText: 'If a child discloses abuse to a volunteer, the volunteer should:',
          options: ['Promise total secrecy', 'Listen calmly, reassure the child, and file an official report within 24 hours', 'Interrogate the child for legal proof', 'Ignore the disclosure'],
          correctOptionIndex: 1,
          explanation: 'Volunteers must listen supportively and immediately escalate the report to the safeguarding lead.'
        }
      ]
    },
    {
      number: '05',
      type: 'Practical Skills',
      title: 'Community Engagement & Dignified Aid Distribution',
      description: 'How to communicate respectfully with beneficiary communities, manage crowd dynamics during relief distribution, and protect community dignity.',
      durationMinutes: 16,
      youtubeUrl: 'https://www.youtube.com/embed/2M6X3f6sA_0',
      keyTakeaways: [
        'Practice active listening and empathetic dialogue',
        'Organize orderly, queue-based distribution points',
        'Uphold dignity and privacy for relief recipients'
      ],
      fullContent: `
### SECTION 1: DIGNITY IN AID DISTRIBUTION
Relief distribution must empower communities rather than create feelings of helplessness or disorder.
- **Queue Management:** Organize separate, shaded queues for pregnant women, mothers with infants, elderly individuals, and persons with disabilities.
- **Token System:** Issue numbered token tickets during morning registration to prevent overcrowding at supply trucks.
- **Transparent Criteria:** Publicly post beneficiary eligibility criteria in local languages on noticeboards.

### SECTION 2: ACTIVE LISTENING & COMMUNITY FEEDBACK
- Engage local village leaders and women\'s committee representatives before setting up site layouts.
- Set up a confidential **Feedback & Complaint Box** at every field site, checked daily by the monitoring team.
      `.trim(),
      quizQuestions: [
        {
          questionText: 'What distribution layout best prevents crowding and chaos during emergency relief drives?',
          options: [
            'Unstructured pile distribution',
            'Orderly, queue-based tokens with designated entry/exit channels',
            'First-come, first-served rush points',
            'Vehicle drop-offs without notice'
          ],
          correctOptionIndex: 1,
          explanation: 'Structured queue points maintain safety and equitable access for elderly and vulnerable recipients.'
        },
        {
          questionText: 'Empathetic community engagement requires field workers to:',
          options: [
            'Impose decisions without consulting local leaders',
            'Listen actively, respect local customs, and involve community representatives',
            'Rush distributions to save time',
            'Limit beneficiary questions'
          ],
          correctOptionIndex: 1,
          explanation: 'Community participation builds long-term trust and sustainable impact.'
        },
        {
          questionText: 'How should feedback or complaints from beneficiaries be handled?',
          options: [
            'Dismissed as unhelpful',
            'Recorded respectfully through established feedback/complaint mechanisms',
            'Publicly debated',
            'Ignored during field operations'
          ],
          correctOptionIndex: 1,
          explanation: 'Complaint channels ensure transparency and continuous improvement in service delivery.'
        },
        {
          questionText: 'Why should separate shaded queues be set up during relief drives?',
          options: ['To slow down distribution', 'To protect elderly, pregnant, and disabled individuals from heat and crowding', 'To separate families permanently', 'To restrict access'],
          correctOptionIndex: 1,
          explanation: 'Specialized queues ensure dignified, safe access for vulnerable groups.'
        },
        {
          questionText: 'How does a token registration system improve aid delivery?',
          options: ['It eliminates paperwork entirely', 'It prevents overcrowding by assigning structured pickup slots', 'It increases transport costs', 'It delays food delivery'],
          correctOptionIndex: 1,
          explanation: 'Token systems organize crowd flow and ensure verified distribution.'
        }
      ]
    },
    {
      number: '06',
      type: 'Practical Skills',
      title: 'Basic First Aid & Field Crisis Response',
      description: 'Essential first aid techniques for field personnel, including CPR basics, wound dressing, fracture immobilization, and heatstroke prevention while awaiting medical transport.',
      durationMinutes: 22,
      youtubeUrl: 'https://www.youtube.com/embed/4K9mD3A4I2Y',
      keyTakeaways: [
        'Perform basic wound care and bleeding control',
        'Identify symptoms of severe dehydration and heatstroke',
        'Apply primary CPR and recovery position procedures'
      ],
      fullContent: `
### SECTION 1: PRIMARY ASSESSMENT (DRABC ACTION PLAN)
When responding to a field medical incident, follow the DRABC protocol:
1. **DANGER:** Check for ongoing environmental hazards (falling debris, live wires, traffic).
2. **RESPONSE:** Check if the casualty is conscious by shaking shoulders and speaking loudly.
3. **AIRWAY:** Tilt head back and lift chin to open the respiratory passage.
4. **BREATHING:** Look, listen, and feel for normal breathing for up to 10 seconds.
5. **CIRCULATION:** Control severe bleeding by applying direct pressure with sterile gauze.

### SECTION 2: MANAGING HEAT EXHAUSTION & HEATSTROKE
In warm climate field zones:
- **Symptoms:** High body temperature, absence of sweating, confusion, rapid pulse.
- **Action:** Immediately move the patient to shade, loosen heavy clothing, apply cool damp cloths to neck and armpits, and arrange urgent medical evacuation.
      `.trim(),
      quizQuestions: [
        {
          questionText: 'What is the immediate primary step before providing first aid to a casualty?',
          options: [
            'Move the patient immediately',
            'Assess scene safety to ensure no danger to yourself or others',
            'Administer oral medication',
            'Apply pressure bandages to all limbs'
          ],
          correctOptionIndex: 1,
          explanation: 'Responders must verify scene safety before entering hazardous areas.'
        },
        {
          questionText: 'What is the correct recovery position for an unconscious, breathing casualty?',
          options: [
            'Flat on their back with legs elevated',
            'Placed on their side with head tilted back to keep airways open',
            'Seated upright',
            'Prone on their stomach face down'
          ],
          correctOptionIndex: 1,
          explanation: 'The lateral recovery position prevents airway obstruction by fluids or the tongue.'
        },
        {
          questionText: 'How should severe heatstroke symptoms (confusion, dry skin, high temp) be treated in the field?',
          options: [
            'Give hot beverages',
            'Move to shade, cool body with wet cloths/ice, and call emergency transport',
            'Cover with thick blankets',
            'Encourage vigorous walking'
          ],
          correctOptionIndex: 1,
          explanation: 'Rapid cooling in shade prevents heatstroke organ failure.'
        },
        {
          questionText: 'What does the "A" stand for in the DRABC first aid assessment protocol?',
          options: ['Ambulance', 'Airway', 'Assessment', 'Allergy'],
          correctOptionIndex: 1,
          explanation: 'A stands for Airway—ensuring the casualty\'s breathing passage is unobstructed.'
        },
        {
          questionText: 'How should severe arterial bleeding on a limb be managed before medical help arrives?',
          options: ['Rinse with warm water only', 'Apply firm, continuous direct pressure with sterile gauze/cloth', 'Cover loosely with paper', 'Elevate legs without applying pressure'],
          correctOptionIndex: 1,
          explanation: 'Direct continuous pressure is the primary method to control severe external bleeding.'
        }
      ]
    },
    {
      number: '07',
      type: 'Compliance',
      title: 'Field Data Collection & Donor Impact Reporting',
      description: 'Guidance on accurate field attendance logging, beneficiary surveys, privacy compliance, and preparing data for grant verification reports.',
      durationMinutes: 14,
      youtubeUrl: 'https://www.youtube.com/embed/3W_kS6zP08U',
      keyTakeaways: [
        'Log beneficiary numbers accurately for donor audits',
        'Protect personally identifiable information (PII)',
        'Submit clear field notes and activity logs'
      ],
      fullContent: `
### SECTION 1: DATA INTEGRITY & AUDIT TRAILS
International donors and grant partners require verifiable audit trails for all distributed materials:
- **Daily Headcount Registers:** Record beneficiary counts accurately without inflating numbers.
- **Itemized Receipts:** Retain all fuel, transport, and local supply purchase receipts.
- **Verification Signatures:** Obtain community elder or committee co-signatures on distribution master lists.

### SECTION 2: DATA PRIVACY & ENCRYPTION
- Encrypt digital survey tablets with passcodes.
- Never leave physical paper registration rosters unattended at field camp sites.
- Upload completed daily surveys over secure HTTPS connections when mobile data is available.
      `.trim(),
      quizQuestions: [
        {
          questionText: 'Why is accurate beneficiary data collection crucial for non-profit operations?',
          options: [
            'For commercial marketing',
            'To verify grant compliance, ensure equitable aid distribution, and report to donors',
            'To increase administrative overhead',
            'For public social media metrics'
          ],
          correctOptionIndex: 1,
          explanation: 'Auditable data verifies that funds directly reached intended communities.'
        },
        {
          questionText: 'Personally Identifiable Information (PII) of beneficiaries should be:',
          options: [
            'Posted on public noticeboards',
            'Stored securely with restricted access to protect privacy',
            'Shared with third-party vendors',
            'Left in open field notebooks'
          ],
          correctOptionIndex: 1,
          explanation: 'Data privacy rules mandate secure handling of vulnerable individual data.'
        },
        {
          questionText: 'When completing field activity logs, responders should ensure entries are:',
          options: [
            'Exaggerated for better funding',
            'Factually accurate, timely, and objective',
            'Vague and general',
            'Submitted months later'
          ],
          correctOptionIndex: 1,
          explanation: 'Timely and accurate logs maintain grant integrity.'
        },
        {
          questionText: 'What should be done with physical paper beneficiary registers at the end of a field day?',
          options: ['Discarded in local trash bins', 'Stored securely in locked file pouches with designated leads', 'Left at the distribution site', 'Given to community bystanders'],
          correctOptionIndex: 1,
          explanation: 'Physical rosters contain PII and must be secured at camp.'
        },
        {
          questionText: 'What is an essential requirement for field supply receipts?',
          options: ['Destroying them after purchase', 'Retaining itemized receipts for financial grant audits', 'Replacing them with estimates', 'Handwriting informal notes'],
          correctOptionIndex: 1,
          explanation: 'Itemized receipts provide financial compliance proof for donor audits.'
        }
      ]
    },
    {
      number: '08',
      type: 'Refresher',
      title: 'Disaster Relief & Rapid Response Refresher',
      description: 'A concise, fast-paced annual refresher module reviewing emergency mobilization steps, radio/phone communications, and personal readiness kits.',
      durationMinutes: 10,
      youtubeUrl: 'https://www.youtube.com/embed/5Z2oN5kXf6g',
      keyTakeaways: [
        'Review 72-hour personal deployment Go-Bag contents',
        'Verify emergency communication channels',
        'Execute rapid team check-in protocols'
      ],
      fullContent: `
### SECTION 1: RAPID MOBILIZATION CHECKLIST
During sudden-onset disasters (earthquakes, flash floods), emergency teams must deploy within 4 to 12 hours:
1. **Standby Notification:** Acknowledge WhatsApp/SMS dispatch alerts within 15 minutes.
2. **Go-Bag Inspection:** Verify battery packs, water purification, prescription meds, and official ID badges.
3. **Base Check-In:** Report to regional staging area for briefing on radio frequencies and team assignments.

### SECTION 2: FIELD COMMUNICATIONS PROTOCOL
- Maintain radio brevity ("Clear, Concise, Complete").
- Use standard phonetic alphabet for location coordinates.
- Report status code every 4 hours during active search and rescue operations.
      `.trim(),
      quizQuestions: [
        {
          questionText: 'What essential item belongs in a responder\'s 72-hour deployment Go-Bag?',
          options: [
            'Excessive luxury items',
            'Water purification tablets, first aid, flashlight, and official ID credentials',
            'Unnecessary paperwork',
            'Fragile glassware'
          ],
          correctOptionIndex: 1,
          explanation: 'Personal Go-Bags ensure responder self-sufficiency during the first 72 hours of disaster response.'
        },
        {
          questionText: 'Upon sudden deployment call-out, a volunteer\'s immediate action is:',
          options: [
            'Travel independently without notification',
            'Confirm receipt via official dispatch channels and complete team roll-call',
            'Wait 48 hours before responding',
            'Contact regional news media'
          ],
          correctOptionIndex: 1,
          explanation: 'Roll-call confirmation ensures deployment coordination and safety tracking.'
        },
        {
          questionText: 'How often should annual field safety and protocol refresher training be completed?',
          options: ['Every 5 years', 'Annually / Before major disaster season deployments', 'Never after initial onboarding', 'Every decade'],
          correctOptionIndex: 1,
          explanation: 'Annual refreshers keep field personnel updated on evolving emergency standards.'
        },
        {
          questionText: 'What is the target mobilization timeframe for rapid response teams during sudden disasters?',
          options: ['Within 4 to 12 hours', 'Within 2 weeks', 'Within 1 month', 'Within 90 days'],
          correctOptionIndex: 0,
          explanation: 'Rapid response teams aim for 4 to 12 hour deployment mobilization.'
        },
        {
          questionText: 'Why is radio brevity important during crisis operations?',
          options: ['To conserve radio battery and keep airwaves clear for emergency traffic', 'To confuse bystanders', 'To limit team discussions', 'To reduce radio range'],
          correctOptionIndex: 0,
          explanation: 'Radio brevity ensures critical emergency transmissions are not blocked.'
        }
      ]
    }
  ];

  const createdModules = [];
  for (const mData of modulesSpecification) {
    const { quizQuestions, ...moduleFields } = mData;

    const createdMod = await Module.create({
      ...moduleFields,
      courseId: course._id
    });

    createdModules.push(createdMod);
    course.modules.push(createdMod._id);

    // Create matching Quiz for Module
    if (quizQuestions && quizQuestions.length > 0) {
      await Quiz.create({
        moduleId: createdMod._id,
        title: `${createdMod.title} Knowledge Check`,
        passingScorePercent: 80,
        questions: quizQuestions
      });
    }
  }

  await course.save();
  console.log(`[Seed Script] Created ${createdModules.length} modules & 5-question quizzes for course '${course.title}'`);

  // 5. Seed 4 Forum Discussions
  await ForumPost.create({
    title: 'Updated Child Safeguarding & Photo Consent Protocols 2026',
    category: 'Announcements',
    body: 'Please review the updated consent guidelines prior to field deployment next week. All photos taken of beneficiaries under 18 must have signed physical or digital guardian consent forms attached.',
    author: adminUser._id,
    replies: [
      {
        author: trainerUser._id,
        body: 'Noted. We will distribute printed consent forms during Monday\'s briefing.',
        createdAt: new Date(Date.now() - 3600000 * 12)
      }
    ]
  });

  await ForumPost.create({
    title: 'Field Report: Queue Management Strategy in Flood Relief Zone B',
    category: 'Field Notes',
    body: 'Sharing a quick tip from yesterday\'s aid distribution in Zone B: Dividing queue lines by family size rather than arrival order reduced wait times by nearly 35% and prevented bottlenecking near the supply trucks.',
    author: volunteerUser._id,
    replies: [
      {
        author: trainerUser._id,
        body: 'Excellent operational adaptation Priya! We will add this queue strategy to Module 05 field guidelines.',
        createdAt: new Date(Date.now() - 3600000 * 36)
      },
      {
        author: adminUser._id,
        body: 'Great work team. Keep reporting site optimization metrics.',
        createdAt: new Date(Date.now() - 3600000 * 20)
      }
    ]
  });

  await ForumPost.create({
    title: 'Question regarding emergency first aid protocols in remote areas',
    category: 'Policy Questions',
    body: 'If cellular network connectivity fails during a field emergency, what is the mandatory fallback protocol to notify regional medical coordinators?',
    author: volunteerUser._id,
    replies: [
      {
        author: trainerUser._id,
        body: 'Use the satellite radio unit stored in the primary vehicle Go-Bag on Channel 4.',
        createdAt: new Date(Date.now() - 3600000 * 60)
      }
    ]
  });

  await ForumPost.create({
    title: 'Language barrier tips during beneficiary surveys',
    category: 'Field Notes',
    body: 'Using visual infographics alongside regional translation guides made survey completion much faster in non-English speaking villages.',
    author: volunteerUser._id,
    replies: []
  });

  console.log('[Seed Script] Seeded 4 realistic community forum noticeboard discussions');
};

const seedData = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_lms';

    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
      console.log(`[Seed Script] Connected to MongoDB at ${mongoUri}`);
    } catch (err) {
      console.warn(`[Seed Script Warning] Local MongoDB connection failed (${err.message}). Booting Embedded In-Memory MongoDB for seeding...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const memServer = await MongoMemoryServer.create();
      mongoUri = memServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`[Seed Script] Connected to Embedded In-Memory MongoDB at ${mongoUri}`);
    }

    await runSeedLogic();

    console.log('\n======================================================');
    console.log(' SEED DATA GENERATION COMPLETE (8 MODULES & 0 PROGRESS)');
    console.log('======================================================');
    console.log(` Admin Login:     admin@humanityfirst.org / password123`);
    console.log(` Trainer Login:   shyamphad03@gmail.com / password123`);
    console.log(` Volunteer Login: volunteer@humanityfirst.org / password123`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Script Error] Seed process failed: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = {
  runSeedLogic,
  seedData
};
