"use client";

import { useEffect, useState } from "react";
import apiClient from "@/utils/api";

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiClient
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>유저 목록</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user.userId}>
            {user.userName} ({user.nickname})
          </li>
        ))}
      </ul>
    </div>
  );
}
