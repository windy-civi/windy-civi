import React from "react";
import { useLoaderData } from "react-router-dom";
import type { PreferencesLoaderData } from "./types";

export function Preferences() {
  const data = useLoaderData() as PreferencesLoaderData;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Preferences</h1>
      <div className="space-y-4">
        {/* Placeholder for preferences UI */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">General Settings</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <button className="px-3 py-1 bg-blue-500 text-white rounded-md">
                Toggle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
