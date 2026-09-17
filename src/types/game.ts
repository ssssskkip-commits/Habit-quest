export type QuestCategory='strength'|'mind'|'creativity'|'wellbeing'
export type Quest={id:string;title:string;category:QuestCategory;rewardXp:number;completed:boolean}
export type Player={name:string;level:number;xp:number;xpToNextLevel:number}
export type EmergingClassHint={id:string;label:string;affinity:number}
