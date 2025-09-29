import React, { createContext, useEffect, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import back2 from '@/assets/back_device_2.png';
import back1 from '@/assets/back_device_1.png';
import ic_delete from '@/assets/delete.png';
import ic_add from '@/assets/ic_add.png';
import ic_more from '@/assets/ic_more.png';
import IconMenu from '../common/IconMenu';
import ic_save from '@/assets/ic_save.png';
import { GetProfiles, AddProfile, DelProfile, getProfileByName, setCurrentProfile } from '@/utils/driver';
import HoverImage from '@/components/common/HoverImage';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useModal } from './ModalContext';
import { toast } from 'sonner';
import { useProfileStore } from '@/store/useProfile';
type ProfileDrawerContextType = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const ProfileDrawerContext = createContext<ProfileDrawerContextType | null>(null);

export const ProfileDrawerProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { currentModelID, currentConfigFileName, setCurrentConfigFileName } = useBaseInfoStore();
  const { defaultProfile, setProfile } = useProfileStore();
  const [visible, setVisible] = useState(false);
  const { openConfirm, openAlert } = useModal();
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const toggle = () => setVisible((v) => !v);

  const [profileList, setProfileList] = useState<string[]>([]);
  const fileMenu = [
    {
      label: t('delete_macro_file'),
      value: 'delete',
      onClick: () => {
        handleDeleteProfile();
      },
    },

    {
      label: t('export_macro_file'),
      value: 'export',
      onClick: () => {},
    },
  ];

  const handleDeleteProfile = (value?: string) => {
    openAlert({
      title: t('confirm_delete_profile'),
      content: t('confirm_delete_profile_desc', { profile: value || currentConfigFileName }),
      onOk: () => {
        DelProfile(currentModelID, currentConfigFileName, (success) => {
          if (success) {
            toast.success(t('delete_profile'));
            _getProfileList();
          }
        });
      },
    });
  };

  const handleCreateProfile = () => {
    openConfirm({
      title: t('create_profile'),
      content: '',
      onOk: (value) => {
        if (!value) return;
        if (profileList.includes(value)) {
          toast.error(t('profile_file_exists'));
          return;
        }
        AddProfile(currentModelID, value, () => {
          setCurrentProfile(currentModelID, value, defaultProfile);
          _getProfileList();
          setCurrentConfigFileName(value);
          toast.success(t('create_profile_desc'));
        });
      },
    });
  };
  const handleSelectProfile = (profile: string) => {
    setCurrentConfigFileName(profile);
    getProfileByName(currentModelID, profile, (data) => {
      if (data) {
        setCurrentProfile(currentModelID, profile, data);
        setProfile(data); // 更新本地profile状态，确保UI正确反映切换后的配置
      }
    });
  };
  const _getProfileList = () => {
    GetProfiles(currentModelID, (profileList) => {
      console.log('Profile list:', profileList);
      setProfileList(profileList);
    });
  };
  useEffect(() => {
    if (currentModelID) {
      _getProfileList();
    }
  }, [currentModelID]);
  return (
    <ProfileDrawerContext.Provider value={{ open, close, toggle }}>
      {children}
      <div className={`drawer-overlay ${visible ? 'show' : ''}`} onClick={close}></div>
      <div className={`drawer drawer-profile ${visible ? 'open' : ''}`}>
        <div className="profile-container">
          <div className="back-content">
            <div className="content-back-btn" onClick={close}>
              <HoverImage src={back1} hoverSrc={back2} alt="Logo" className="back-btn-icon" />
              {t('back_to_home')}
            </div>
          </div>
          <div className="profile-container-center">
            <div className="profile-header">
              <div>配置列表</div>
              <div>
                <HoverImage src={ic_save} hoverSrc={ic_save} alt="ic_save" className="back-btn-icon" />
                <HoverImage
                  src={ic_delete}
                  hoverSrc={ic_delete}
                  alt="ic_delete"
                  className="back-btn-icon"
                  onClick={() => handleDeleteProfile()}
                />
                <HoverImage
                  src={ic_add}
                  hoverSrc={ic_add}
                  alt="ic_add"
                  className="back-btn-icon"
                  onClick={() => handleCreateProfile()}
                />
              </div>
            </div>
            <div>
              <div className="macro-file-group">
                <ul>
                  {profileList &&
                    profileList.map((profile: string) => (
                      <li
                        className={`${currentConfigFileName === profile ? 'active' : ''} macro-file-item`}
                        key={profile}
                        onClick={() => handleSelectProfile(profile)}
                      >
                        <span>{profile}</span>
                        <IconMenu
                          icon={<HoverImage src={ic_more} hoverSrc={ic_more} alt="ic_more" className="back-btn-icon" />}
                          menu={fileMenu}
                        />
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="profile-game"></div>
        </div>
      </div>
    </ProfileDrawerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProfileDrawer = () => {
  const ctx = useContext(ProfileDrawerContext);
  if (!ctx) throw new Error('useSettingsDrawer must be used inside SettingsDrawerProvider');
  return ctx;
};
