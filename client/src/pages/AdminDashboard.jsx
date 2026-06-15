import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    isAdmin: false,
    plan: "free",
    requestLimit: 100,
  });
  const baseUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseUrl}/api/admin/dashboard`,
        {
          withCredentials: true,
        }
      );

      setUsers(data.users || []);
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`${baseUrl}/api/admin/user/${id}`, {
        withCredentials: true,
      });

      setUsers((prev) =>
        prev.filter((u) => u._id !== id)
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  const startEdit = (user) => {
    setEditingId(user._id);
    setEditUser({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      plan: user.plan,
      requestLimit: user.requestLimit,
    });
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `${baseUrl}/api/admin/user/${editingId}`,
        editUser,
        {
          withCredentials: true,
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === editingId
            ? { ...u, ...editUser }
            : u
        )
      );

      setEditingId(null);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update user"
      );
    }
  };

  const totalUsers = users.length;
  const totalAdmins = users.filter(
    (u) => u.isAdmin
  ).length;
  const proUsers = users.filter(
    (u) => u.plan === "pro"
  ).length;

  return (
  <div className="min-h-screen bg-black text-white relative overflow-hidden">
    {/* Background Glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#4c1d95_0%,transparent_35%),radial-gradient(circle_at_bottom_right,#0891b2_0%,transparent_30%)] opacity-40 pointer-events-none"></div>

    <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.3em] text-xs mb-2">
            ADMIN PANEL
          </p>
          <h1 className="text-5xl font-bold">
            Dashboard{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Control Center
            </span>
          </h1>
        </div>

        <button
          onClick={loadDashboard}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20"
        >
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "Total Users",
            value: totalUsers,
          },
          {
            title: "Admin Users",
            value: totalAdmins,
          },
          {
            title: "Pro Users",
            value: proUsers,
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_30px_rgba(139,92,246,0.15)]"
          >
            <p className="text-gray-400 text-sm mb-3">
              {card.title}
            </p>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-semibold">
            User Management
          </h2>
          <span className="text-sm text-gray-400">
            {users.length} users found
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">
              Loading dashboard...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10 text-gray-300">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left font-medium">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Limit
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Admin
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Messages
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-all"
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      {editingId === user._id ? (
                        <input
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
                          value={editUser.name}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        user.name
                      )}
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      {editingId === user._id ? (
                        <input
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
                          value={editUser.email}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              email: e.target.value,
                            })
                          }
                        />
                      ) : (
                        user.email
                      )}
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4 text-center">
                      {editingId === user._id ? (
                        <select
                          value={editUser.plan}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              plan: e.target.value,
                            })
                          }
                          className="bg-black/20 border border-white/10 rounded-xl px-3 py-2"
                        >
                          <option value="free">
                            Free
                          </option>
                          <option value="pro">
                            Pro
                          </option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-sm border ${
                            user.plan === "pro"
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                              : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                          }`}
                        >
                          {user.plan.toUpperCase()}
                        </span>
                      )}
                    </td>

                    {/* Request Limit */}
                    <td className="px-6 py-4 text-center">
                      {editingId === user._id ? (
                        <input
                          type="number"
                          className="w-24 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-center"
                          value={editUser.requestLimit}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              requestLimit: Number(
                                e.target.value
                              ),
                            })
                          }
                        />
                      ) : (
                        user.requestLimit
                      )}
                    </td>

                    {/* Admin */}
                    <td className="px-6 py-4 text-center">
                      {editingId === user._id ? (
                        <input
                          type="checkbox"
                          checked={editUser.isAdmin}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              isAdmin:
                                e.target.checked,
                            })
                          }
                        />
                      ) : user.isAdmin ? (
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30">
                          User
                        </span>
                      )}
                    </td>

                    {/* Total Messages */}
                    <td className="px-6 py-4 text-center">
                      {user.totalMessages}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      {editingId ===
                      user._id ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={saveEdit}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-105 transition-all"
                          >
                            Save
                          </button>

                          <button
                            onClick={() =>
                              setEditingId(null)
                            }
                            className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              startEdit(user)
                            }
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105 transition-all"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                user._id
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {!loading &&
                  users.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-16 text-gray-400"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default AdminDashboard;