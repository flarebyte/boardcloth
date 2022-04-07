import { Subject } from "rxjs";
import { BoardclothMessage } from "../message/messaging";

/**
 * A Subject is a special type of Observable that allows messages to be multicasted to many Observers
 */
export class SubjectManager {
    private _subject = new Subject<BoardclothMessage>()
    send(message: BoardclothMessage){
        this._subject.next(message);
    }
}