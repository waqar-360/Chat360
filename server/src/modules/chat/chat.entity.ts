import { User } from '../user';
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity({
  name: 'chats',
})
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => User, (user) => user.uuid)
  from: User;

  @ManyToOne(() => User, (user) => user.uuid)
  to: User;

  @OneToMany(() => Message, (message) => message.chat)
  message: Message[];
}
