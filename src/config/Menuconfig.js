const menuItems = [
  {
    id: 1,
    name: "Dashboard",
    icon: "bi-grid",
    path: "/dashboard",
    roles: ["SUPER_ADMIN", "OWNER"],
  },

  {
    id: 2,
    name: "Add Members",
    icon: "bi-people",
    path: "/members/add",
    roles: ["SUPER_ADMIN", "OWNER"],
  },

  {
    id: 3,
    name: "members",
    icon: "bi-calendar-check",
    path: "/members/list",
    roles: ["SUPER_ADMIN", "OWNER"],
  },
  // {
  //   id: 3,
  //   name: "Attendance",
  //   icon: "bi-calendar-check",
  //   path: "/attendance",
  //   roles: ["super-admin", "owner", "trainer"],
  // },

  {
    id: 4,
    name: "Membership Plans",
    icon: "bi-card-checklist",
    path: "/membership-plans",
    roles: ["SUPER_ADMIN", "OWNER"],
  },

  {
    id: 5,
    name: "Trainers",
    icon: "bi-person-workspace",
    path: "/trainers",
    roles: ["SUPER_ADMIN", "OWNER"],
  },

  {
    id: 6,
    name: "Create User",
    icon: "bi-credit-card",
    path: "/create-user",
    roles: ["SUPER_ADMIN"],
  },
  {
    id: 7,
    name: "Gym Network",
    icon: "bi-credit-card",
    path: "/gym-management",
    roles: ["SUPER_ADMIN"],
  },
  // {
  //   id: 8,
  //   name: "Payments",
  //   icon: "bi-credit-card",
  //   path: "/payments",
  //   roles: ["super-admin", "owner"],
  // },

  // {
  //   id: 9,
  //   name: "Expenses",
  //   icon: "bi-wallet2",
  //   path: "/expenses",
  //   roles: ["super-admin", "owner"],
  // },

  // {
  //   id: 10,
  //   name: "Enquiries / Leads",
  //   icon: "bi-person-lines-fill",
  //   path: "/enquiries",
  //   roles: ["super-admin", "owner"],
  // },

  // {
  //   id: 11,
  //   name: "Workout Plans",
  //   icon: "bi-activity",
  //   path: "/workout-plans",
  //   roles: ["super-admin", "owner", "trainer"],
  // },

  // {
  //   id: 12,
  //   name: "Diet Plans",
  //   icon: "bi-clipboard2-pulse",
  //   path: "/diet-plans",
  //   roles: ["super-admin", "owner", "trainer"],
  // },

  // {
  //   id: 13,
  //   name: "Reports",
  //   icon: "bi-file-earmark-bar-graph",
  //   path: "/reports",
  //   roles: ["super-admin", "owner"],
  // },

  // {
  //   id: 14,
  //   name: "Notifications",
  //   icon: "bi-bell",
  //   path: "/notifications",
  //   roles: ["super-admin", "owner", "trainer"],
  // },

  // {
  //   id: 15,
  //   name: "Settings",
  //   icon: "bi-gear",
  //   path: "/settings",
  //   roles: ["super-admin", "owner"],
  // },
];

export default menuItems;