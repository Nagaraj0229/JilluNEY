import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByUid(uid: string) {
    return this.userModel.findOne({ uid }).exec();
  }

  async upsertFromFirebaseToken(decoded: any) {
    const uid = decoded.uid as string;
    const email = decoded.email as string | undefined;
    const displayName =
      (decoded.name as string | undefined) ?? decoded.displayName;
    const photoURL =
      (decoded.picture as string | undefined) ?? decoded.photoURL;

    const update = { email, displayName, photoURL };
    const opts = { new: true, upsert: true, setDefaultsOnInsert: true };
    const doc = await this.userModel
      .findOneAndUpdate({ uid }, { $set: update }, opts)
      .lean();
    return doc;
  }
}
