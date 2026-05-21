// import { v4 as uuid } from "uuid";
// import { MessageStatus } from "../enums/MessageStatus";

// export class Message {
//   constructor(
//     private readonly id: string,
//     private readonly senderId: string,
//     private readonly receiverId: string,
//     private readonly conversationId: string,
//     private readonly content: string,
//     private readonly createdAt: Date,
//     private status: MessageStatus = MessageStatus.SENT
//   ) {}

//   static create(senderId: string, receiverId: string, conversationId: string, content: string): Message {
//     return new Message(
//       uuid(),
//       senderId,
//       receiverId,
//       conversationId,
//       content,
//       new Date(),
//       MessageStatus.SENT
//     );
//   }

//   getId(): string { return this.id; }
//   getSenderId(): string { return this.senderId; }
//   getReceiverId(): string { return this.receiverId; }
//   getConversationId(): string { return this.conversationId; }
//   getContent(): string { return this.content; }
//   getCreatedAt(): Date { return this.createdAt; }
//   getStatus(): MessageStatus { return this.status; }

//   setStatus(status: MessageStatus): void {
//     this.status = status;
//   }

//   markAsSeen(): void {
//     this.status = MessageStatus.SEEN;
//   }
// }
import {v4 as uuid} from "uuid";
import { MessageStatus } from "@domain/enums/MessageStatus";
export class Message{
  constructor(
    private readonly id:string,
    private readonly senderId:string,
    private readonly receiverId:string,
    private readonly conversationId:string,
    private readonly content:string,
    private readonly createdAt:Date,
    private status:MessageStatus=MessageStatus.SENT,
    private readonly attachmentUrl?:string,
    private readonly attachmentType?:string
  ){}
  static create(
    senderId:string,
    receiverId:string,
    conversationId:string,
    content :string,
    attachmentUrl?:string,
    attachmentType?:string
  ):Message{
    return new Message(
      uuid(),
      senderId,
      receiverId,
      conversationId,
      content,
      new Date(),
      MessageStatus.SENT,
      attachmentUrl,
      attachmentType

    );
  }
  //getters
  getId():string{
    return this.id;
  }
  getSenderId():string{
    return this.senderId;
  }
  getReceiverId():string{
    return this.receiverId;
  }
  getConversationId():string{
    return this.conversationId;
  }
  getContent():string{
    return this.content;
  }
  getCreatedAt():Date{
    return this.createdAt;
  }
  getStatus():MessageStatus{
    return this.status;
  }
  getAttachmentUrl():string|undefined{
    return this.attachmentUrl;

  }
  getAttachmentType():string|undefined{
    return this.attachmentType;
  }
  setStatus(status:MessageStatus):void{
    this.status=status;

  }
  markAsSeen():void{
    this.status=MessageStatus.SEEN;
  }

}