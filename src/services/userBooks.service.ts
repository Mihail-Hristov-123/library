import { UserManager } from "./user.service.js";
import { BookManager } from "./book.service.js";

import { CustomError } from "../CustomError.js";

export class UserBooksManager {
  static instance: UserBooksManager;
  private userManager = UserManager.getInstance();
  private bookManager = BookManager.getInstance();

  private constructor() {}

  static getInstance() {
    if (!UserBooksManager.instance) {
      UserBooksManager.instance = new UserBooksManager();
    }
    return UserBooksManager.instance;
  }

  async getUserDashboard(userId: number) {
    if (!userId) {
      throw new CustomError(
        "CLIENT",
        "A valid user ID should be included in the request parameters"
      );
    }

    const [user, books] = await Promise.all([
      this.userManager.findUser(userId),
      this.bookManager.findBooksByPublisher(userId),
    ]);

    if (!user || !books) {
      throw new CustomError(
        "NOT_FOUND",
        "User or corresponding publications not found"
      );
    }

    return {
      user: {
        name: user.name,
        email: user.email,
        activeSince: new Date(user.creation_date).toDateString(),
      },
      publications: books.length ? books : "None so far",
    };
  }
}
