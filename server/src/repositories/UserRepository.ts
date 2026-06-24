import { User, type IUser, type UserDocument } from '../models/User';
import { BaseRepository } from './BaseRepository';

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  /** Fetch a user including the normally-hidden password + refresh hash fields. */
  findByEmailWithSecrets(email: string): Promise<UserDocument | null> {
    return User.findOne({ email: email.toLowerCase() })
      .select('+password +refreshTokenHash')
      .exec() as Promise<UserDocument | null>;
  }

  findByIdWithSecrets(id: string): Promise<UserDocument | null> {
    return User.findById(id).select('+password +refreshTokenHash').exec() as Promise<UserDocument | null>;
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email: email.toLowerCase() }).exec() as Promise<UserDocument | null>;
  }
}

export const userRepository = new UserRepository();
