"use client";

import { useEffect } from "react";
import {
  initialFoodNotifications,
  getStoredFoodNotifications,
  saveFoodNotifications,
} from "@/lib/mock-data";

useEffect(() => {
  const existing = getStoredFoodNotifications();
  if (existing.length === 0) {
    saveFoodNotifications(initialFoodNotifications);
  }
}, []);
