/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from 'react';
import { api, type RouterOutputs } from '~/utils/api';

type TeamUser = RouterOutputs["teamMember"]["getTeamMembers"][number];

type TeamInputSearchProps = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  onSelect: (user: TeamUser) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  teamId: string;
};

export const TeamInputSearch = ({
  label,
  value,
  onChange,
  onSelect,
  placeholder,
  required,
  className,
  teamId,
}: TeamInputSearchProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value ?? "");
  const ref = useRef<HTMLDivElement>(null);

  const { data: members } = api.teamMember.getTeamMembers.useQuery(
    { teamId },
    { enabled: !!teamId }
  );

  const filtered = members?.filter((m) =>
    m.username.toLowerCase().includes(search.toLowerCase()) ||
    (m.name ?? "").toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (val: string) => {
    setSearch(val);
    onChange(val);
    setOpen(true);
  };

  const handleSelect = (user: TeamUser) => {
    setSearch(user.username);
    onChange(user.username);
    onSelect(user);
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={ref}>
      <label className={`block text-xs font-medium text-gray-500 mb-1.5 ${className}`}>
        {label}
        {required && <span className="text-red-400">{" *"}</span>}
      </label>
      <input
        type="text"
        value={search}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
        required={required}
      />

      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
          {filtered.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleSelect(user)}
              className="flex w-full items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
              <img
                src={`https://api.dicebear.com/10.x/micah/svg?seed=${user.image ?? user.username}`}
                alt={user.username}
                className="h-7 w-7 rounded-full bg-gray-100 flex-shrink-0"
              />
              <div>
                <p className="text-[13px] font-medium text-gray-900">{user.name}</p>
                <p className="text-[11px] text-gray-400">@{user.username}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};