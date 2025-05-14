/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./src/auth/lucia").Auth;
  type DatabaseUserAttributes = {
    name: string | null;
    email: string | null;
  };
  type DatabaseSessionAttributes = {};
}

// This is important for Lucia to work correctly with TypeScript
declare global {
  namespace App {
    interface Locals {
      auth: import("lucia").AuthRequest;
    }
  }
}
