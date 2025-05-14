/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./src/auth/lucia").Auth;
  type DatabaseUserAttributes = {
    name: string | null;
    email: string | null;
  };
  type DatabaseSessionAttributes = {};
}
