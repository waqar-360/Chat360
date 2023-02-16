import { User } from '../user';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chat } from './chat.entity';

@Entity({
  name: 'messages',
})
export class Message {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  text: string;

  @Column({
    default: false,
  })
  isdelivered: boolean;

  @Column({
    default: false,
  })
  isseen: boolean;

  @Column()
  createdAt: number;

  @ManyToOne(() => Chat, (chat) => chat.uuid)
  chat: Chat;

  @ManyToOne(() => User, (user) => user.uuid)
  sender: User;
}
