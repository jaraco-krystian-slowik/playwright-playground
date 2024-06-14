import { APPURL } from "./.config";

export class AccessToken {
  constructor(readonly login: string, readonly password: string) {}

  async getToken() {
    try {
      const response = await fetch(`${APPURL.API}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            email: this.login,
            password: this.password,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resBody = await response.json();
      return resBody.user.token;
    } catch (error) {
      console.error("Error fetching the token:", error);
      throw error;
    }
  }
}
