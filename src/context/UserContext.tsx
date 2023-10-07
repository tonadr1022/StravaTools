// "use client";
// import { createContext, createServerContext, useState } from "react";
// import { User } from "@prisma/client";

// interface UserContextValue {
//   user: User | null;
//   setUser: (user: User | null) => void;
// }

// export const UserContext = createServerContext<UserContextValue>({
//   user: null,
//   setUser: () => {},
// });

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
