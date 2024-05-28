import conf from "../conf/conf.js";
import { client, Account, ID } from 'appwrite';

export class AuthService {
  client = new client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteprojectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        // call another method
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser({}) {
    try {
      return await this.account.get();
    } catch (error) {
      // throw error;
      // can also do console log here
      console.log("Appwrite service :: getCurrentUser :: error", error);
    }

    return null;
  }

  async logout({}) {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }
}

const authservice = new AuthService();

export default authservice;
