import { User } from "../generated/prisma/client";

export function renderCurrentUser(user: User) {
  return {
    id: user.uuid,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    firebaseUid: user.firebaseUid,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}
