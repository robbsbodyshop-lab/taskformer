// ═══════════════════════════════════════════════════════════════
// TMNT Personality System — Core Data
// ═══════════════════════════════════════════════════════════════

export type TurtleName = 'leo' | 'donnie' | 'raph' | 'mikey'
export type TurtleRole = 'LEADERSHIP' | 'RESEARCH' | 'EXECUTION' | 'CREATIVE'
export type AllyName = 'splinter' | 'april' | 'casey'

// ───────────────────────────────────────────────────────────────
// Core Turtle Definitions
// ───────────────────────────────────────────────────────────────

export interface TurtleProfile {
  id: TurtleName
  name: string
  fullTitle: string
  color: string          // tailwind-friendly hex
  colorClass: string     // for tailwind bg/text
  bandana: string        // emoji representation
  weapon: string
  weaponEmoji: string
  archetype: string
  role: TurtleRole
  roleLabel: string
  personality: string[]  // adjective tags
  motto: string
  description: string
  sortPreference: string // how this turtle sorts tasks
  focusStyle: string     // combat/focus description
}

export const TURTLES: Record<TurtleName, TurtleProfile> = {
  leo: {
    id: 'leo',
    name: 'Leonardo',
    fullTitle: 'Leonardo — The Devoted Student',
    color: '#4169E1',
    colorClass: 'blue',
    bandana: '🔵',
    weapon: 'Twin Katanas',
    weaponEmoji: '⚔️',
    archetype: 'The Leader',
    role: 'LEADERSHIP',
    roleLabel: 'Planning & Leadership',
    personality: ['Stoic', 'Selfless', 'Disciplined'],
    motto: 'A leader is not made by authority, but by example.',
    description: 'Precision strikes and strategic thinking. Complete planned tasks in order for bonus XP.',
    sortPreference: 'Priority + Due Date',
    focusStyle: 'Precision-based. Economy of motion and strategic strikes.',
  },
  donnie: {
    id: 'donnie',
    name: 'Donatello',
    fullTitle: 'Donatello — The Technologist',
    color: '#9370DB',
    colorClass: 'purple',
    bandana: '🟣',
    weapon: 'Bō Staff',
    weaponEmoji: '🏑',
    archetype: 'The Intellectual',
    role: 'RESEARCH',
    roleLabel: 'Research & Systems',
    personality: ['Rational', 'Inquisitive', 'Methodical'],
    motto: 'Every problem is a system waiting to be understood.',
    description: 'Calculated defense and reach. Build recurring systems and earn bonus XP for consistency.',
    sortPreference: 'Category + Recurrence',
    focusStyle: 'Calculated and defensive. Greatest reach, analyzing weaknesses.',
  },
  raph: {
    id: 'raph',
    name: 'Raphael',
    fullTitle: 'Raphael — The Rebel',
    color: '#DC143C',
    colorClass: 'red',
    bandana: '🔴',
    weapon: 'Twin Sai',
    weaponEmoji: '🗡️',
    archetype: 'The Muscle',
    role: 'EXECUTION',
    roleLabel: 'Hard Execution',
    personality: ['Hot-headed', 'Fierce', 'Loyal'],
    motto: "When strategy fails, you need someone willing to break through.",
    description: 'Close-quarters power. Tackle the hardest task first for massive bonus XP.',
    sortPreference: 'Highest Priority First',
    focusStyle: 'Brawling and close-quarters. Punishing strikes at maximum intensity.',
  },
  mikey: {
    id: 'mikey',
    name: 'Michelangelo',
    fullTitle: 'Michelangelo — The Wild Card',
    color: '#FF6B35',
    colorClass: 'orange',
    bandana: '🟠',
    weapon: 'Nunchaku',
    weaponEmoji: '🥊',
    archetype: 'The Spirit',
    role: 'CREATIVE',
    roleLabel: 'Creative & Fun',
    personality: ['Optimistic', 'Creative', 'Unpredictable'],
    motto: 'Cowabunga! Life is meant to be enjoyed, dude.',
    description: 'Fluid combos and momentum. Chain quick wins together for escalating combo XP.',
    sortPreference: 'Newest + Quick Wins',
    focusStyle: 'Unpredictable and fluid. Momentum, misdirection, and agility.',
  },
}

export const TURTLE_LIST: TurtleProfile[] = [
  TURTLES.leo, TURTLES.donnie, TURTLES.raph, TURTLES.mikey,
]

export const ROLE_TO_TURTLE: Record<TurtleRole, TurtleName> = {
  LEADERSHIP: 'leo',
  RESEARCH: 'donnie',
  EXECUTION: 'raph',
  CREATIVE: 'mikey',
}

// ───────────────────────────────────────────────────────────────
// Ally Definitions
// ───────────────────────────────────────────────────────────────

export interface AllyProfile {
  id: AllyName
  name: string
  title: string
  emoji: string
  description: string
}

export const ALLIES: Record<AllyName, AllyProfile> = {
  splinter: {
    id: 'splinter',
    name: 'Master Splinter',
    title: 'The Sensei',
    emoji: '🐀',
    description: 'Provides wisdom, mentorship, and context-aware guidance when you drift off course.',
  },
  april: {
    id: 'april',
    name: "April O'Neil",
    title: 'The Intel Officer',
    emoji: '📡',
    description: 'Delivers daily intelligence briefs on your task landscape and priority hotspots.',
  },
  casey: {
    id: 'casey',
    name: 'Casey Jones',
    title: 'The Enforcer',
    emoji: '🏒',
    description: 'Activates Chaos Mode — high-intensity sprint challenges when you need to break through.',
  },
}

// ───────────────────────────────────────────────────────────────
// Dynamic Dialogue System (#8)
// ───────────────────────────────────────────────────────────────

export interface DialogueSet {
  taskComplete: string[]
  habitComplete: string[]
  emptyTasks: string
  emptyHabits: string
  greeting: string[]
  encouragement: string[]
  overdue: string[]
  levelUp: string[]
  streak: string[]
}

export const DIALOGUES: Record<TurtleName, DialogueSet> = {
  leo: {
    taskComplete: [
      'Mission accomplished. On to the next objective.',
      'Excellent discipline. Splinter would be proud.',
      'One step closer to mastery.',
      'Clean execution. That\'s the way of the blade.',
    ],
    habitComplete: [
      'Consistency is the path to honor.',
      'Another day of discipline. Well done.',
      'The kata continues. Stay focused.',
    ],
    emptyTasks: 'A clear battlefield. Plan your next strategic move.',
    emptyHabits: 'No habits tracked yet. A warrior without practice is unprepared.',
    greeting: [
      'Report in. What\'s the mission today?',
      'Focus your mind. The day ahead requires discipline.',
      'Remember: every task is a step toward mastery.',
    ],
    encouragement: [
      'Stay the course. Leaders don\'t quit.',
      'Doubt is natural. Pushing through it is what makes a leader.',
      'Splinter taught us: discipline defeats talent when talent isn\'t disciplined.',
    ],
    overdue: [
      'These tasks are past due. Regroup and prioritize.',
      'We\'re falling behind. Time to refocus, team.',
      'An overdue task is an exposed flank. Address it now.',
    ],
    levelUp: [
      'Your training elevates. New rank achieved.',
      'Honor earned through perseverance. Level up!',
    ],
    streak: [
      'Unwavering. Your discipline streak grows.',
      'The blade stays sharp through daily practice.',
    ],
  },
  donnie: {
    taskComplete: [
      'Task resolved. Logging results for analysis.',
      'Problem solved. Efficiency rate: excellent.',
      'Another variable accounted for. Nice work.',
      'System optimized. Moving to next module.',
    ],
    habitComplete: [
      'Habit data point recorded. Pattern holding strong.',
      'Recurring process maintained. Systems stable.',
      'Consistency metric improved. Well done.',
    ],
    emptyTasks: 'No active tasks in the queue. Time to architect something new.',
    emptyHabits: 'No habits configured. Let\'s build a recurring system.',
    greeting: [
      'Systems online. Let\'s optimize today.',
      'Morning diagnostic complete. Ready for operations.',
      'I\'ve been analyzing the data. Here\'s what needs attention.',
    ],
    encouragement: [
      'Every problem is solvable with the right approach.',
      'Think of it as debugging your day.',
      'Small iterative improvements compound into massive results.',
    ],
    overdue: [
      'Warning: overdue tasks detected. Priority queue needs adjustment.',
      'Technical debt accumulating. Let\'s clear the backlog.',
      'These items are blocking the pipeline. Intervention recommended.',
    ],
    levelUp: [
      'Processing... upgrade complete. New capabilities unlocked.',
      'Experience data integrated. Level increased.',
    ],
    streak: [
      'Streak algorithm stable. Keep the pattern running.',
      'Consecutive execution confirmed. Impressive uptime.',
    ],
  },
  raph: {
    taskComplete: [
      'Crushed it. Next.',
      'That\'s how it\'s done. No mercy.',
      'One down. Who\'s next?',
      'Boom. Don\'t mess with productivity.',
    ],
    habitComplete: [
      'Day handled. That\'s consistency with attitude.',
      'Another rep in the bag. Stay hungry.',
      'Showed up again. That\'s what counts.',
    ],
    emptyTasks: 'Nothing to fight? Go find something worth doing.',
    emptyHabits: 'No habits? You need a training regimen, tough guy.',
    greeting: [
      'Let\'s do this. No excuses.',
      'Another day, another fight. Bring it.',
      'I don\'t do "easy mode." Let\'s hit the hard stuff first.',
    ],
    encouragement: [
      'Pain is temporary. Quitting lasts forever.',
      'You think the Foot Clan takes days off? Neither do we.',
      'Channel the anger into action. That\'s how we win.',
    ],
    overdue: [
      'These are overdue?! Get on it. NOW.',
      'We don\'t leave tasks behind. Handle your business.',
      'Overdue tasks are a sign of weakness. Fix it.',
    ],
    levelUp: [
      'YEAH! Power up! Let\'s keep this energy going!',
      'Level up! Now we\'re getting dangerous.',
    ],
    streak: [
      'Streak alive! Nobody can stop this momentum!',
      'Day after day. That\'s the Raph way.',
    ],
  },
  mikey: {
    taskComplete: [
      'Cowabunga! Nailed it! 🍕',
      'Dude, that task didn\'t stand a chance!',
      'Booyakasha! Another one bites the dust!',
      'High five! ...anyone? Okay, self high five!',
    ],
    habitComplete: [
      'Habit streak? More like RADICAL streak! 🔥',
      'Dude, consistency looks good on you!',
      'Pizza-powered productivity! Keep it up!',
    ],
    emptyTasks: 'No tasks? Time for pizza and brainstorming! 🍕',
    emptyHabits: 'No habits yet? Let\'s create something fun to track, dude!',
    greeting: [
      'GOOD MORNING! Today\'s gonna be AWESOME!',
      'Rise and shine, party people! Let\'s make today radical!',
      'Dude! The vibes are immaculate today. Let\'s go!',
    ],
    encouragement: [
      'Hey, even ninjas have off days. You got this!',
      'Remember: you\'re a NINJA. Act like it! 💪',
      'Life\'s a party and tasks are just the cover charge, dude.',
    ],
    overdue: [
      'Uhh... these are kinda overdue, bro. No judgment!',
      'Overdue tasks? Let\'s turn this around with style!',
      'Okay okay, we fell behind. But comebacks are our thing!',
    ],
    levelUp: [
      'LEVEL UP BABY! COWABUNGA! 🎉🍕',
      'Dude... we just leveled up! This calls for PIZZA!',
    ],
    streak: [
      'STREAK CITY! We\'re on FIRE! 🔥🔥🔥',
      'Combo multiplier activated! Keep the chain alive!',
    ],
  },
}

// ───────────────────────────────────────────────────────────────
// Splinter Guidance (#4)
// ───────────────────────────────────────────────────────────────

export interface SplinterTip {
  condition: string   // machine-readable condition key
  message: string
  icon: string
}

export const SPLINTER_GUIDANCE: SplinterTip[] = [
  {
    condition: 'many_overdue',
    message: 'My son, a mountain of undone tasks weighs heavier than any enemy. Prioritize ruthlessly — do not try to fight every battle at once.',
    icon: '🐀',
  },
  {
    condition: 'no_habits',
    message: 'A warrior without daily practice will falter when the moment comes. Start with one small habit — mastery begins with a single rep.',
    icon: '🐀',
  },
  {
    condition: 'all_raph_tasks',
    message: 'You carry Raphael\'s fire, but even he needs his brothers. Balance your hard execution with planning and creativity.',
    icon: '🐀',
  },
  {
    condition: 'all_leo_tasks',
    message: 'Planning is noble, Leonardo, but a plan without action is merely a dream. Execute something today.',
    icon: '🐀',
  },
  {
    condition: 'no_categories',
    message: 'An organized mind is a powerful weapon. Create categories to bring order to the chaos of the surface world.',
    icon: '🐀',
  },
  {
    condition: 'streak_broken',
    message: 'A broken streak is not defeat — it is an invitation to begin again with greater wisdom. Resume your training.',
    icon: '🐀',
  },
  {
    condition: 'high_completion',
    message: 'Excellent work. You honor our family with your dedication. But remember — rest is also a form of strength.',
    icon: '🐀',
  },
  {
    condition: 'first_day',
    message: 'Welcome, young one. Every master was once a beginner. Start small, stay consistent, and the path will reveal itself.',
    icon: '🐀',
  },
  {
    condition: 'balanced_roles',
    message: 'I see harmony in your work — leadership, intellect, strength, and spirit in balance. This is the way of true mastery.',
    icon: '🐀',
  },
  {
    condition: 'default',
    message: 'Remember: the obstacle is not in your way — it IS the way. Face your tasks with courage.',
    icon: '🐀',
  },
]

// ───────────────────────────────────────────────────────────────
// Weapon Focus Mechanics (#7)
// ───────────────────────────────────────────────────────────────

export interface WeaponBonus {
  turtle: TurtleName
  name: string
  description: string
  bonusPercent: number
  condition: string
}

export const WEAPON_BONUSES: WeaponBonus[] = [
  {
    turtle: 'leo',
    name: 'Katana Precision',
    description: 'Complete 3 planned tasks in priority order',
    bonusPercent: 25,
    condition: 'priority_order_3',
  },
  {
    turtle: 'donnie',
    name: 'Bō Reach',
    description: 'Complete tasks across 3+ categories in one day',
    bonusPercent: 20,
    condition: 'multi_category_3',
  },
  {
    turtle: 'raph',
    name: 'Sai Strike',
    description: 'Complete the highest-priority task first today',
    bonusPercent: 30,
    condition: 'hardest_first',
  },
  {
    turtle: 'mikey',
    name: 'Nunchaku Combo',
    description: 'Complete 4+ tasks in a single session',
    bonusPercent: 35,
    condition: 'chain_4',
  },
]

// ───────────────────────────────────────────────────────────────
// Story Arc Seasons (#9)
// ───────────────────────────────────────────────────────────────

export interface StoryArc {
  id: string
  title: string
  description: string
  emoji: string
  durationDays: number
  roleEmphasis: TurtleRole
  goals: StoryGoal[]
  reward: string
  rewardXP: number
}

export interface StoryGoal {
  description: string
  type: 'tasks_complete' | 'habits_complete' | 'streak' | 'role_tasks'
  target: number
  roleFilter?: TurtleRole
}

export const STORY_ARCS: StoryArc[] = [
  {
    id: 'foot_clan_pressure',
    title: 'Foot Clan Pressure',
    description: 'The Foot Clan is advancing! Clear your backlog and hold the line.',
    emoji: '🦶',
    durationDays: 7,
    roleEmphasis: 'EXECUTION',
    goals: [
      { description: 'Complete 10 tasks', type: 'tasks_complete', target: 10 },
      { description: 'Maintain a 3-day habit streak', type: 'streak', target: 3 },
      { description: 'Complete 3 Execution tasks', type: 'role_tasks', target: 3, roleFilter: 'EXECUTION' },
    ],
    reward: 'Foot Clan Survivor',
    rewardXP: 500,
  },
  {
    id: 'tech_recovery',
    title: 'Tech Recovery Mission',
    description: 'Donnie needs help restoring the lab! Focus on building systems and organization.',
    emoji: '🔧',
    durationDays: 7,
    roleEmphasis: 'RESEARCH',
    goals: [
      { description: 'Create 2 categories', type: 'tasks_complete', target: 2 },
      { description: 'Complete 5 Research tasks', type: 'role_tasks', target: 5, roleFilter: 'RESEARCH' },
      { description: 'Maintain a 5-day habit streak', type: 'streak', target: 5 },
    ],
    reward: 'Lab Restoration Badge',
    rewardXP: 500,
  },
  {
    id: 'sewer_sprint',
    title: 'Sewer Sprint',
    description: 'Speed through the sewers! Chain quick wins and keep momentum flowing.',
    emoji: '🏃',
    durationDays: 5,
    roleEmphasis: 'CREATIVE',
    goals: [
      { description: 'Complete 15 tasks in 5 days', type: 'tasks_complete', target: 15 },
      { description: 'Complete 4 Creative tasks', type: 'role_tasks', target: 4, roleFilter: 'CREATIVE' },
    ],
    reward: 'Sewer Speedster',
    rewardXP: 400,
  },
  {
    id: 'leadership_trial',
    title: "Leonardo's Leadership Trial",
    description: 'Prove your discipline. Plan ahead, prioritize, and lead by example.',
    emoji: '⚔️',
    durationDays: 7,
    roleEmphasis: 'LEADERSHIP',
    goals: [
      { description: 'Complete 5 Leadership tasks', type: 'role_tasks', target: 5, roleFilter: 'LEADERSHIP' },
      { description: 'Complete 8 tasks total', type: 'tasks_complete', target: 8 },
      { description: 'Maintain a 7-day habit streak', type: 'streak', target: 7 },
    ],
    reward: 'Katana Master',
    rewardXP: 600,
  },
  {
    id: 'pizza_party',
    title: 'Pizza Party Week',
    description: 'Mikey says: work hard, party harder! Hit all your goals and earn a celebration.',
    emoji: '🍕',
    durationDays: 7,
    roleEmphasis: 'CREATIVE',
    goals: [
      { description: 'Complete 12 tasks', type: 'tasks_complete', target: 12 },
      { description: 'Complete tasks in all 4 roles', type: 'tasks_complete', target: 4 },
      { description: 'Complete all habits for 3 days', type: 'habits_complete', target: 3 },
    ],
    reward: 'Pizza Party Champion',
    rewardXP: 550,
  },
  {
    id: 'shredder_showdown',
    title: 'Shredder Showdown',
    description: 'The final boss approaches. Give everything you\'ve got this week.',
    emoji: '🔥',
    durationDays: 7,
    roleEmphasis: 'EXECUTION',
    goals: [
      { description: 'Complete 20 tasks', type: 'tasks_complete', target: 20 },
      { description: 'Maintain a 7-day habit streak', type: 'streak', target: 7 },
      { description: 'Complete 5 Execution tasks', type: 'role_tasks', target: 5, roleFilter: 'EXECUTION' },
      { description: 'Complete 3 Leadership tasks', type: 'role_tasks', target: 3, roleFilter: 'LEADERSHIP' },
    ],
    reward: 'Shredder Slayer',
    rewardXP: 800,
  },
]

// Get the current story arc based on week number
export function getCurrentStoryArc(): StoryArc {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const weekNumber = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000)
  )
  return STORY_ARCS[weekNumber % STORY_ARCS.length]
}

// ───────────────────────────────────────────────────────────────
// Casey Chaos Mode (#6) Presets
// ───────────────────────────────────────────────────────────────

export interface ChaosPreset {
  name: string
  description: string
  durationMinutes: number
  emoji: string
  xpMultiplier: number
}

export const CHAOS_PRESETS: ChaosPreset[] = [
  {
    name: 'Quick Jab',
    description: 'Smash one task in 5 minutes flat.',
    durationMinutes: 5,
    emoji: '🏒',
    xpMultiplier: 1.5,
  },
  {
    name: 'Street Brawl',
    description: 'Pick your hardest task. 15 minutes. No distractions.',
    durationMinutes: 15,
    emoji: '💥',
    xpMultiplier: 2.0,
  },
  {
    name: 'Full Rampage',
    description: 'Chain as many tasks as possible in 25 minutes. Go wild.',
    durationMinutes: 25,
    emoji: '🔥',
    xpMultiplier: 2.5,
  },
]

// ───────────────────────────────────────────────────────────────
// Helper: random element from array
// ───────────────────────────────────────────────────────────────

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
