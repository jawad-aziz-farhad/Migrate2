import { StudyData } from "./index";

export class Rounds {

    private roundStartTime: any;
    private roundEndTime: any;
    private data: Array<StudyData>;

    constructor(){}

    /* SETTERS */
    setRoundStartTime(roundStartTime: any){ this.roundStartTime = roundStartTime; }
    setRoundEndTime(roundEndTime: any){ this.roundEndTime = roundEndTime; }
    setRoundData(data: Array<StudyData>){ this.data = data; }

    /* GETTERS */
    getRoundStartTime(): any { return this.roundStartTime; }
    getRoundEndTime(): any { return this.roundEndTime; }
    getRoundData(): any { return this.data; }
    
}