import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, ChevronDown, Check, Wifi, WifiOff } from 'lucide-react';
import { Language, Role, UserProfile } from '../types';
import { getT } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onOpenEmergency: () => void;
  pendingSyncCount: number;
  onSyncPending: () => void;
  onOpenSettings: () => void;
  isOffline: boolean;
  onOpenOfflineModal: () => void;
  currentUser?: UserProfile;
  users?: UserProfile[];
  onSelectUser?: (user: UserProfile) => void;
  coopNotificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  currentRole,
  onRoleChange,
  onOpenEmergency,
  pendingSyncCount,
  onSyncPending,
  onOpenSettings,
  isOffline,
  onOpenOfflineModal,
  currentUser,
  users = [],
  onSelectUser,
  coopNotificationCount = 0,
}) => {
  const t = getT(language);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#EAE6DE] shadow-[0_1px_8px_rgba(0,0,0,0.03)] px-3 py-2.5 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and App Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] p-0.5 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
            <img
              src="/assets/aistudio/JeevaRaksha_Livestock_Care_Emblem_30be6ac5.png"
              alt="JeevaRaksha Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#1C251D] leading-tight">
              {t.app_title}
            </h1>
            <p className="text-[11px] sm:text-xs text-[#5C665D] font-medium hidden xs:block">
              {t.app_subtitle}
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2">
          {/* Offline Sync Badge (if any pending) */}
          {pendingSyncCount > 0 && (
            <button
              onClick={onSyncPending}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] hover:bg-[#FDE68A] transition-colors"
              title={t.pending_sync}
            >
              {pendingSyncCount} {t.pending_sync}
            </button>
          )}

          {/* Offline Mode Indicator Button (Placed directly to the left of Emergency Help) */}
          <button
            onClick={onOpenOfflineModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-2xs active:scale-95 ${
              isOffline
                ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] hover:bg-[#FDE68A]'
                : 'bg-[#F4F1EA] text-[#374151] border-[#E5E0D5] hover:bg-[#EAE5DB]'
            }`}
            title={
              language === 'kn'
                ? 'ಆಫ್‌ಲೈನ್ ಕಾರ್ಯವಿಧಾನ ಮತ್ತು ಸಿಂಕ್'
                : 'Offline mode & local sync architecture'
            }
          >
            {isOffline ? (
              <WifiOff className="w-3.5 h-3.5 stroke-[2.5] text-[#D97706]" />
            ) : (
              <Wifi className="w-3.5 h-3.5 stroke-[2.5] text-[#1E6B38]" />
            )}
            <span className="hidden sm:inline">
              {isOffline
                ? language === 'kn'
                  ? 'ಆಫ್‌ಲೈನ್'
                  : 'Offline'
                : language === 'kn'
                ? 'ಆನ್‌ಲೈನ್'
                : 'Online'}
            </span>
          </button>

          {/* Emergency Help Button (Icons used strictly per spec: emergency) */}
          {currentRole === 'farmer' && (
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DC2626] text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-[#B91C1C] active:scale-95 transition-all"
              aria-label={t.emergency_help}
            >
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">{t.emergency_help}</span>
              <span className="sm:hidden">1962</span>
            </button>
          )}

          {/* Language Switcher: EN / ಕನ್ನಡ */}
          <div className="flex items-center rounded-lg bg-[#F4F1EA] p-0.5 border border-[#E5E0D5]">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-white text-[#1E6B38] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('kn')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                language === 'kn'
                  ? 'bg-white text-[#1E6B38] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Settings / Info */}
          <button
            onClick={onOpenSettings}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#F4F1EA] text-[#4B5563] hover:bg-[#EAE5DB] transition-colors"
            title="System & AI Settings"
          >
            ⚙
          </button>
        </div>
      </div>

      {/* Role Navigation Bar & Active User Dropdown */}
      <div className="max-w-4xl mx-auto mt-2 pt-2 border-t border-[#F2EFE8] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[#78857B] uppercase tracking-wider hidden xs:inline">
            {t.switch_role}:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onRoleChange('farmer');
                if (currentUser?.role !== 'farmer' && onSelectUser) {
                  const defaultFarmer = users.find((u) => u.role === 'farmer');
                  if (defaultFarmer) onSelectUser(defaultFarmer);
                }
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                currentRole === 'farmer'
                  ? 'bg-[#1E6B38] text-white shadow-xs'
                  : 'bg-transparent text-[#4B5563] hover:bg-[#EAE5DB]'
              }`}
            >
              {t.role_farmer}
            </button>
            <button
              onClick={() => {
                onRoleChange('vet');
                if (currentUser?.role !== 'vet' && onSelectUser) {
                  const defaultVet = users.find((u) => u.role === 'vet');
                  if (defaultVet) onSelectUser(defaultVet);
                }
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                currentRole === 'vet'
                  ? 'bg-[#1E6B38] text-white shadow-xs'
                  : 'bg-transparent text-[#4B5563] hover:bg-[#EAE5DB]'
              }`}
            >
              {t.role_vet}
            </button>
            <button
              onClick={() => {
                onRoleChange('officer');
                if (currentUser?.role !== 'officer' && onSelectUser) {
                  const defaultOfficer = users.find((u) => u.role === 'officer');
                  if (defaultOfficer) onSelectUser(defaultOfficer);
                }
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentRole === 'officer'
                  ? 'bg-[#1E6B38] text-white shadow-xs'
                  : 'bg-transparent text-[#4B5563] hover:bg-[#EAE5DB]'
              }`}
            >
              <span>{t.role_officer}</span>
              {coopNotificationCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    currentRole === 'officer'
                      ? 'bg-white text-[#1E6B38]'
                      : 'bg-[#DC2626] text-white animate-pulse'
                  }`}
                >
                  {coopNotificationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* User Profile Selector Pill */}
        {currentUser && onSelectUser && (
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#D5CFBE] hover:bg-white text-xs font-bold text-[#1C251D] shadow-2xs transition-colors"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: currentUser.avatarColor }}
              />
              <span>{language === 'kn' ? currentUser.nameKn : currentUser.name}</span>
              <span className="text-[10px] text-[#78857B] font-normal hidden sm:inline">
                ({currentUser.village})
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#78857B]" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-1 w-64 bg-white border border-[#EAE6DE] rounded-xl shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] font-bold text-[#78857B] uppercase px-2 py-1">
                  {t.select_user_profile}
                </div>

                {/* Farmer Group */}
                <div className="mt-1">
                  <div className="text-[10px] font-bold text-[#1E6B38] px-2 py-0.5">
                    👨‍🌾 {t.farmer_profiles}
                  </div>
                  {users
                    .filter((u) => u.role === 'farmer')
                    .map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSelectUser(u);
                          onRoleChange(u.role);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-[#EBF5EE] font-bold text-[#1E6B38]'
                            : 'text-[#2D3748] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div>
                          <div>{language === 'kn' ? u.nameKn : u.name}</div>
                          <div className="text-[10px] text-[#78857B]">{u.village}</div>
                        </div>
                        {u.id === currentUser.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                </div>

                {/* Vet Group */}
                <div className="mt-2 pt-1 border-t border-[#F2EFE8]">
                  <div className="text-[10px] font-bold text-[#1E6B38] px-2 py-0.5">
                    🩺 {t.vet_profiles}
                  </div>
                  {users
                    .filter((u) => u.role === 'vet')
                    .map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSelectUser(u);
                          onRoleChange(u.role);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-[#EBF5EE] font-bold text-[#1E6B38]'
                            : 'text-[#2D3748] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div>
                          <div>{language === 'kn' ? u.nameKn : u.name}</div>
                          <div className="text-[10px] text-[#78857B]">{u.village} • {u.title}</div>
                        </div>
                        {u.id === currentUser.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                </div>

                {/* Officer Group */}
                <div className="mt-2 pt-1 border-t border-[#F2EFE8]">
                  <div className="text-[10px] font-bold text-[#1E6B38] px-2 py-0.5">
                    🏢 {t.officer_profiles}
                  </div>
                  {users
                    .filter((u) => u.role === 'officer')
                    .map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSelectUser(u);
                          onRoleChange(u.role);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-[#EBF5EE] font-bold text-[#1E6B38]'
                            : 'text-[#2D3748] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div>
                          <div>{language === 'kn' ? u.nameKn : u.name}</div>
                          <div className="text-[10px] text-[#78857B]">{u.village}</div>
                        </div>
                        {u.id === currentUser.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

