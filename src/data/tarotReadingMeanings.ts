export type ReadingMeaning = {
  upright: string;
  reversed: string;
  reflection: string;
};

// Original reflective cues informed by the Rider–Waite–Smith tradition.
// Reversals explore blocked, inward, excessive, or releasing energy; they are not predictions.
export const tarotReadingMeanings: Record<string, ReadingMeaning> = {
  'major-00': {
    upright: 'A fresh beginning invites curiosity, openness, and a first step without a complete map.',
    reversed: 'Excitement may be outrunning preparation, or caution may be keeping you at the starting line.',
    reflection: 'What small step would let you explore without ignoring the obvious risks?',
  },
  'major-01': {
    upright: 'You have useful skills and ingredients available; focused action brings them together.',
    reversed: 'Scattered attention or impressive presentation may be getting ahead of substance.',
    reflection: 'What could you make happen with what is already on the bar?',
  },
  'major-02': {
    upright: 'Quiet observation and intuition deserve room alongside what can already be explained.',
    reversed: 'Outside noise may be drowning out your judgment, or an untested assumption may feel like certainty.',
    reflection: 'What do you sense, and what would help you check it?',
  },
  'major-03': {
    upright: 'Care, creativity, and a supportive environment give something worthwhile room to grow.',
    reversed: 'Giving too much or demanding constant growth may be leaving little room for your own needs.',
    reflection: 'What needs nurturing, including in your own life?',
  },
  'major-04': {
    upright: 'Clear boundaries and dependable structure can turn intention into something that holds up.',
    reversed: 'Control may have become rigid, or missing structure may be making every task harder.',
    reflection: 'Which boundary or routine would support you without becoming a cage?',
  },
  'major-05': {
    upright: 'Shared traditions, good teachers, and established practices offer a foundation for learning.',
    reversed: 'An inherited rule may need questioning before it deserves your continued loyalty.',
    reflection: 'Which teaching still serves you, and which have you outgrown?',
  },
  'major-06': {
    upright: 'Connection deepens when choices reflect your values and everyone involved can choose freely.',
    reversed: 'Conflicting values or an unspoken compromise may be pulling a choice or relationship out of alignment.',
    reflection: 'What would an honest choice require you to acknowledge?',
  },
  'major-07': {
    upright: 'Commitment and direction help competing impulses move toward a shared purpose.',
    reversed: 'Forcing the pace or chasing incompatible goals may be exhausting your ability to steer.',
    reflection: 'Where are you heading, and what needs to move together to get there?',
  },
  'major-08': {
    upright: 'Patient courage and a steady response can accomplish more than force.',
    reversed: 'Self-doubt or prolonged strain may be making gentleness harder to offer yourself.',
    reflection: 'What would strength look like if you did not have to prove it?',
  },
  'major-09': {
    upright: 'A deliberate pause from outside demands can make your own judgment easier to hear.',
    reversed: 'Solitude may have become isolation, or constant company may be helping you avoid reflection.',
    reflection: 'Do you need some quiet, or someone safe to let into it?',
  },
  'major-10': {
    upright: 'Circumstances move in cycles, inviting flexibility about what you can influence and what you cannot.',
    reversed: 'Resistance to change or a repeating pattern may be worth examining before pushing harder.',
    reflection: 'What keeps returning, and where do you still have a choice?',
  },
  'major-11': {
    upright: 'A fair decision asks for evidence, proportion, and responsibility for the consequences.',
    reversed: 'Bias, unequal treatment, or avoided accountability may be distorting the situation.',
    reflection: 'Whose perspective or evidence is missing from your judgment?',
  },
  'major-12': {
    upright: 'A willing pause can reveal a perspective that effort alone has not produced.',
    reversed: 'Waiting may have lost its purpose, or releasing control may feel harder than staying stuck.',
    reflection: 'What could change if you stopped trying to solve this from the same angle?',
  },
  'major-13': {
    upright: 'An ending or transition asks you to release an old form so something different has room.',
    reversed: 'Holding onto what has run its course may be prolonging an uncomfortable transition.',
    reflection: 'What are you ready to stop carrying into the next chapter?',
  },
  'major-14': {
    upright: 'Patient adjustment helps different needs and strengths work together in a sustainable balance.',
    reversed: 'An uneven mix or an unsustainable pace may need adjustment before adding anything else.',
    reflection: 'What needs a smaller measure, and what deserves a little more?',
  },
  'major-15': {
    upright: 'A habit, attachment, or power dynamic may be narrowing your choices more than you want.',
    reversed: 'Recognising a binding pattern can open space for support, boundaries, and a gradual release.',
    reflection: 'What is this attachment costing you, and what support could widen your choices?',
  },
  'major-16': {
    upright: 'A disruption can expose a weak foundation and make an ignored truth difficult to avoid.',
    reversed: 'You may be absorbing an upheaval privately or delaying a change whose warning signs are already visible.',
    reflection: 'What needs stabilising now, and what no longer deserves rebuilding?',
  },
  'major-17': {
    upright: 'Hope can return through small acts of care, honesty, and renewed connection to what matters.',
    reversed: 'Discouragement may be obscuring available support or making renewal feel too far away.',
    reflection: 'What modest act would help you trust the next step a little more?',
  },
  'major-18': {
    upright: 'Uncertainty calls for curiosity about feelings and assumptions before treating them as facts.',
    reversed: 'Confusion may be beginning to clear, though certainty does not need to be rushed.',
    reflection: 'What is known, what is imagined, and what still needs checking?',
  },
  'major-19': {
    upright: 'Clarity, warmth, and uncomplicated enjoyment make it easier to participate fully in life.',
    reversed: 'Joy may feel muted or private, especially if you are measuring it against an impossible standard.',
    reflection: 'What is worth enjoying without first turning it into an achievement?',
  },
  'major-20': {
    upright: 'Honest reflection invites you to answer a meaningful call and act on what you have learned.',
    reversed: 'Harsh self-judgment or an avoided decision may be keeping useful insight from becoming change.',
    reflection: 'What would taking responsibility look like without putting yourself on trial forever?',
  },
  'major-21': {
    upright: 'A cycle reaches completion as separate efforts come together into something you can acknowledge and integrate.',
    reversed: 'Loose ends or reluctance to call something complete may be keeping the next chapter out of reach.',
    reflection: 'What would help you recognise the finish and carry the lesson forward?',
  },
  'ace-of-cups': {
    upright: 'A new feeling, connection, or creative impulse invites emotional openness.',
    reversed: 'Feelings may need private attention before you can comfortably share or act on them.',
    reflection: 'What feeling deserves room before you decide what to do with it?',
  },
  'two-of-cups': {
    upright: 'Mutual attention and respect create the conditions for a meaningful connection or agreement.',
    reversed: 'Unequal effort or crossed expectations may call for a more honest conversation.',
    reflection: 'What would reciprocity look like for everyone involved?',
  },
  'three-of-cups': {
    upright: 'Friendship, shared celebration, and community remind you that good things can be enjoyed together.',
    reversed: 'Social pressure, excess, or feeling outside the circle may be complicating a need for connection.',
    reflection: 'Which company leaves you feeling included and more yourself?',
  },
  'four-of-cups': {
    upright: 'Disengagement may be asking for a pause to notice what you actually want and what is being offered.',
    reversed: 'Interest may be returning as you reconsider an overlooked possibility on your own terms.',
    reflection: 'What have you stopped noticing, and is it worth another look?',
  },
  'five-of-cups': {
    upright: 'Disappointment deserves acknowledgment without requiring you to overlook what still offers support.',
    reversed: 'Acceptance may be making room for reconnection while leaving space for what still hurts.',
    reflection: 'What can support you while you make room for the loss?',
  },
  'six-of-cups': {
    upright: 'A memory, familiar kindness, or simple pleasure may reconnect you with something you value.',
    reversed: 'Nostalgia may be editing the past too generously or making the present compete with it.',
    reflection: 'What from the past is worth carrying forward without trying to live there?',
  },
  'seven-of-cups': {
    upright: 'Many appealing possibilities invite imagination, followed by a closer look at what each actually involves.',
    reversed: 'Priorities may be coming into focus as you separate workable choices from attractive distractions.',
    reflection: 'Which option still appeals once you include the effort and trade-offs?',
  },
  'eight-of-cups': {
    upright: 'Something can matter to you and still no longer provide what you need to continue.',
    reversed: 'Hesitation about leaving may invite a clearer distinction between unfinished work and staying from habit.',
    reflection: 'What would make staying or leaving a deliberate choice?',
  },
  'nine-of-cups': {
    upright: 'Satisfaction invites you to appreciate what is enough and enjoy something you have worked toward.',
    reversed: 'An appealing reward may not be meeting the need you hoped it would satisfy.',
    reflection: 'What feels fulfilling after the novelty wears off?',
  },
  'ten-of-cups': {
    upright: 'Shared values and emotional belonging can make an ordinary life feel richly connected.',
    reversed: 'An ideal picture of happiness may be obscuring different needs within your close circle.',
    reflection: 'What does belonging look like for the people actually involved?',
  },
  'page-of-cups': {
    upright: 'Curiosity and emotional openness invite an unexpected idea or a feeling you have not named yet.',
    reversed: 'Sensitivity or embarrassment may be keeping a tender idea from getting a fair hearing.',
    reflection: 'What could you explore if you allowed yourself to be a beginner at it?',
  },
  'knight-of-cups': {
    upright: 'Imagination and sincere feeling can give a proposal, conversation, or creative pursuit its direction.',
    reversed: 'An inspiring gesture may need steadier follow-through or a closer look beyond the fantasy.',
    reflection: 'What practical action would make the sentiment believable?',
  },
  'queen-of-cups': {
    upright: 'Attentive listening and emotional awareness help you respond with care without losing your own perspective.',
    reversed: 'Taking in everyone else’s feelings may be leaving too little space for your own boundaries.',
    reflection: 'What can you care about without taking responsibility for all of it?',
  },
  'king-of-cups': {
    upright: 'Emotional steadiness lets you acknowledge strong feelings while choosing a considered response.',
    reversed: 'Composure may be hiding unspoken feelings, or those feelings may be steering more than you intend.',
    reflection: 'What needs acknowledgment before you can respond fairly?',
  },
  'ace-of-pentacles': {
    upright: 'A practical opportunity invites a modest first investment of attention, effort, or resources.',
    reversed: 'A promising beginning may need firmer conditions or a more realistic plan before you commit.',
    reflection: 'What would make this opportunity workable in everyday life?',
  },
  'two-of-pentacles': {
    upright: 'Adaptability helps you balance changing demands while noticing what your capacity actually allows.',
    reversed: 'Too many moving parts may be asking for fewer commitments and clearer priorities.',
    reflection: 'Which demand can move, shrink, or leave the rotation?',
  },
  'three-of-pentacles': {
    upright: 'Different skills and shared standards help a collaborative effort become better than individual guesswork.',
    reversed: 'Unclear roles or unshared expectations may be making capable people work against one another.',
    reflection: 'What needs agreeing before everyone keeps building?',
  },
  'four-of-pentacles': {
    upright: 'Protecting your resources can create stability, though security also needs room to breathe.',
    reversed: 'A tight grip may be loosening as you reconsider what to protect and what to share.',
    reflection: 'What are you safeguarding, and what is the grip costing you?',
  },
  'five-of-pentacles': {
    upright: 'Hardship or exclusion calls for practical support and recognition of barriers you should not have to face alone.',
    reversed: 'A route toward support or reconnection may be opening, even if the wider difficulty remains.',
    reflection: 'What help is accessible, and what would make it easier to reach?',
  },
  'six-of-pentacles': {
    upright: 'Giving and receiving work best when support respects dignity and acknowledges unequal resources.',
    reversed: 'Hidden obligations or unequal power may be complicating an apparently generous exchange.',
    reflection: 'What expectations come with this help, and are they fair?',
  },
  'seven-of-pentacles': {
    upright: 'A pause to assess your effort can clarify what deserves patience and what needs adjustment.',
    reversed: 'Impatience or continued effort without review may be keeping you invested in the wrong approach.',
    reflection: 'What evidence would tell you to keep tending, change course, or stop?',
  },
  'eight-of-pentacles': {
    upright: 'Repeated, attentive practice builds a level of skill that shortcuts rarely provide.',
    reversed: 'Perfectionism or mechanical repetition may be replacing useful learning with more hours.',
    reflection: 'What specific part of the craft would benefit from deliberate practice?',
  },
  'nine-of-pentacles': {
    upright: 'Earned independence and thoughtful enjoyment invite you to appreciate the life your effort supports.',
    reversed: 'Keeping up appearances or proving self-sufficiency may be costing more than the comfort is worth.',
    reflection: 'What does having enough mean when nobody else is watching?',
  },
  'ten-of-pentacles': {
    upright: 'Lasting security grows through shared resources, continuity, and care that reaches beyond one person.',
    reversed: 'Inherited expectations or unequal access to shared resources may need an honest reassessment.',
    reflection: 'What are you helping sustain, and who gets to benefit from it?',
  },
  'page-of-pentacles': {
    upright: 'Practical curiosity turns a new interest into something you can study, test, and gradually develop.',
    reversed: 'Planning or distraction may be keeping a useful lesson from becoming a small piece of practice.',
    reflection: 'What can you try this week that would teach you something concrete?',
  },
  'knight-of-pentacles': {
    upright: 'Reliable effort and careful follow-through help a worthwhile commitment progress at a sustainable pace.',
    reversed: 'A dependable routine may have become stubbornness, or the pace may no longer match your capacity.',
    reflection: 'What needs consistency, and what needs a better method?',
  },
  'queen-of-pentacles': {
    upright: 'Practical care makes everyday life more supportive through resourcefulness, comfort, and attention to real needs.',
    reversed: 'Looking after everything else may be leaving your own time and resources under-supported.',
    reflection: 'What would make caring for yourself part of the arrangement?',
  },
  'king-of-pentacles': {
    upright: 'Sound stewardship uses experience and resources to build stability that other people can rely on.',
    reversed: 'Status, possession, or excessive caution may be crowding out the purpose of having resources.',
    reflection: 'How could what you manage serve people more effectively?',
  },
  'ace-of-wands': {
    upright: 'A new spark of interest invites experimentation before you know exactly where it will lead.',
    reversed: 'An idea may need better timing, renewed energy, or a smaller first attempt to catch.',
    reflection: 'What would be an enjoyable way to test this spark?',
  },
  'two-of-wands': {
    upright: 'Looking beyond familiar ground helps you choose a direction and consider what expansion would require.',
    reversed: 'Overplanning or reluctance to leave familiar territory may be delaying a meaningful choice.',
    reflection: 'What information do you still need before planning becomes postponement?',
  },
  'three-of-wands': {
    upright: 'Early effort creates a vantage point for wider possibilities and the next stage of a venture.',
    reversed: 'Delays or overlooked limits may call for revising your expectations and extending your view.',
    reflection: 'What is the next sensible reach from where you actually stand?',
  },
  'four-of-wands': {
    upright: 'A shared milestone offers a chance to celebrate the people and foundations that made it possible.',
    reversed: 'Belonging or celebration may need a form that fits your circumstances rather than an expected script.',
    reflection: 'What would make this milestone feel welcoming and worth marking?',
  },
  'five-of-wands': {
    upright: 'Competing ideas can sharpen the work if the disagreement has enough structure to stay useful.',
    reversed: 'Conflict may be easing, or avoiding it may be leaving the actual disagreement unresolved.',
    reflection: 'What are you really competing over, and what would make the contest useful?',
  },
  'six-of-wands': {
    upright: 'Recognition invites you to accept an achievement while remembering the support behind it.',
    reversed: 'External approval may be unreliable, making it useful to define success on more grounded terms.',
    reflection: 'What would still count as progress without the applause?',
  },
  'seven-of-wands': {
    upright: 'A position or boundary you value may need a clear, confident defence.',
    reversed: 'Constant defensiveness or too many battles may be draining the strength needed for what matters.',
    reflection: 'Which boundary is worth defending, and which argument can you leave alone?',
  },
  'eight-of-wands': {
    upright: 'Gathering momentum asks for timely communication and enough coordination to keep up with events.',
    reversed: 'Delays or rushed exchanges may need clearer sequencing before the pace increases again.',
    reflection: 'What needs communicating clearly before the next thing moves?',
  },
  'nine-of-wands': {
    upright: 'Experience has built resilience, though continuing wisely may also require boundaries and support.',
    reversed: 'Prolonged vigilance may be asking for rest or a reassessment of what still needs defending.',
    reflection: 'What would help you continue without staying braced for everything?',
  },
  'ten-of-wands': {
    upright: 'Too much responsibility can make even meaningful work difficult to carry well.',
    reversed: 'A burden may be ready to be shared or released instead of quietly becoming yours by default.',
    reflection: 'What are you carrying simply because you were the last person to say yes?',
  },
  'page-of-wands': {
    upright: 'Enthusiasm and curiosity make room for a new experiment without demanding mastery at the outset.',
    reversed: 'A restless search for the next spark may be keeping any one experiment from developing.',
    reflection: 'Which idea deserves enough attention to get past the exciting first five minutes?',
  },
  'knight-of-wands': {
    upright: 'Bold initiative can move a possibility into action when enthusiasm has somewhere useful to go.',
    reversed: 'Haste or inconsistent follow-through may be turning strong energy into unnecessary detours.',
    reflection: 'What would give this burst of energy a useful direction?',
  },
  'queen-of-wands': {
    upright: 'Warm confidence and independence let you take up space while encouraging other people to do the same.',
    reversed: 'Comparison or overextension may be pulling attention away from your own source of confidence.',
    reflection: 'Where could you act more like yourself without waiting to be invited?',
  },
  'king-of-wands': {
    upright: 'A clear vision becomes effective leadership when it gives other people direction and room to contribute.',
    reversed: 'Impatience or attachment to your own vision may be crowding out useful challenge and shared ownership.',
    reflection: 'Who needs more room to help shape what you are building?',
  },
  'ace-of-swords': {
    upright: 'A clear insight or direct conversation can separate the central issue from surrounding confusion.',
    reversed: 'An argument may sound sharp while resting on assumptions that still need checking.',
    reflection: 'What can you state clearly, and what evidence supports it?',
  },
  'two-of-swords': {
    upright: 'A held decision may need quiet consideration and information that is currently outside your view.',
    reversed: 'Avoidance or information overload may be making a difficult choice feel even less manageable.',
    reflection: 'What is the smallest missing piece that would help you decide?',
  },
  'three-of-swords': {
    upright: 'A painful truth or disappointment asks for acknowledgment and care rather than an immediate explanation.',
    reversed: 'Healing may be taking place unevenly, with space still needed for what remains unresolved.',
    reflection: 'What would help you be honest about the hurt without having to solve it today?',
  },
  'four-of-swords': {
    upright: 'A deliberate interval of rest can help you recover perspective before re-entering a demanding situation.',
    reversed: 'Restlessness or prolonged strain may be making it harder to recognise and respect your need for a pause.',
    reflection: 'What would make genuine rest possible rather than merely stopping work?',
  },
  'five-of-swords': {
    upright: 'A conflict asks you to consider whether winning the exchange is worth its effect on trust.',
    reversed: 'Stepping away or attempting repair may matter more than keeping the argument alive.',
    reflection: 'What outcome could you live with after the satisfaction of being right wears off?',
  },
  'six-of-swords': {
    upright: 'A gradual transition can move you toward calmer conditions while you carry unfinished feelings with you.',
    reversed: 'An interrupted transition may need support, practical arrangements, or attention to what keeps pulling you back.',
    reflection: 'What would make the next part of this transition more manageable?',
  },
  'seven-of-swords': {
    upright: 'A private strategy or indirect approach invites scrutiny of its purpose, honesty, and effect on others.',
    reversed: 'An avoided issue may be ready for a more direct approach or an honest account of your part in it.',
    reflection: 'What are you avoiding saying plainly, and why?',
  },
  'eight-of-swords': {
    upright: 'Feeling constrained calls for distinguishing real barriers from assumptions while taking both seriously.',
    reversed: 'A small opening or new support may help you test a choice that previously felt unavailable.',
    reflection: 'Which barrier needs outside help, and which assumption can you safely test?',
  },
  'nine-of-swords': {
    upright: 'Worry may be looping without producing new information, making support and perspective especially valuable.',
    reversed: 'Naming a fear aloud may create some distance from it, even if relief takes time.',
    reflection: 'What could you share with someone trustworthy instead of carrying through another round alone?',
  },
  'ten-of-swords': {
    upright: 'A painful ending may need acknowledgment before you can stop spending energy trying to reverse it.',
    reversed: 'The first steps beyond a difficult ending may be small, uneven, and still worth recognising.',
    reflection: 'What can you stop reopening, and what support would help you move forward?',
  },
  'page-of-swords': {
    upright: 'Curiosity and careful questioning can uncover something useful when you remain willing to revise your view.',
    reversed: 'Restless scrutiny or speaking before checking may be creating more noise than understanding.',
    reflection: 'What would you need to verify before repeating or acting on this?',
  },
  'knight-of-swords': {
    upright: 'Decisive action can serve a clear purpose when conviction stays connected to the facts.',
    reversed: 'Speed and certainty may be outrunning context, consent, or the people affected by your approach.',
    reflection: 'What might you notice if you slowed down before charging ahead?',
  },
  'queen-of-swords': {
    upright: 'Clear judgment and honest boundaries can coexist with openness to another person’s experience.',
    reversed: 'Protective distance or a sharp response may be preventing a fairer understanding from reaching you.',
    reflection: 'How could you be direct without closing the conversation too soon?',
  },
  'king-of-swords': {
    upright: 'Reasoned authority asks for sound evidence, clear principles, and responsibility for how decisions affect others.',
    reversed: 'Intellectual certainty or selective reasoning may be turning useful authority into inflexibility.',
    reflection: 'What evidence would change your mind, and have you made room to hear it?',
  },
};

export const readingSources = [
  {
    title: 'A. E. Waite, The Pictorial Key to the Tarot (1911), illustrated by Pamela Colman Smith',
    url: 'https://original.sacred-texts.com/tarot/pkt/index.htm',
    note: 'Primary source for the deck’s symbolic tradition; the reading cues above are original modern interpretations, not quotations or promises of future events.',
  },
];
