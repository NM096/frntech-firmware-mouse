import React, { createContext, useEffect, useContext, useState, useRef, use } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import back2 from '@/assets/back_device_2.png';
import back1 from '@/assets/back_device_1.png';
import ic_delete from '@/assets/delete.png';
import ic_add from '@/assets/ic_add.png';
import ic_more from '@/assets/ic_more.png';
import IconMenu from '../common/IconMenu';
import ic_save from '@/assets/ic_save.png';
import ic_addv2 from '@/assets/ic_addv2.png';
import ic_close from '@/assets/ic_close2.png';
import {
  GetProfiles,
  AddProfile,
  DelProfile,
  getProfileByName,
  setCurrentProfile,
  setReportRate,
  setAdvanceSetting,
  setDPI,
  apply,
  setLE,
  importProfile,
  exportProfile,
  setSelectProfile,
  getSelectProfile,
  getExeIcon,
  RenameProfile,
} from '@/utils/driver';
import HoverImage from '@/components/common/HoverImage';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useModal } from './ModalContext';
import { toast } from 'sonner';
import { useProfileStore } from '@/store/useProfile';
import type { Profile } from '@/types/profile';
import Portal from './Portal';
import { cloneDeep } from 'lodash';
import useProfileAction from '@/hooks/useProfileAction';

const { dialog } = require('electron').remote;
type ProfileDrawerContextType = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const ProfileDrawerContext = createContext<ProfileDrawerContextType | null>(null);

export const ProfileDrawerProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { currentModelID, currentConfigFileName, setCurrentConfigFileName, path, mode, currentDevice } =
    useBaseInfoStore();
  const { profile, setProfile } = useProfileStore();
  const { handleSelectProfile: hookSelectProfile, resetDPIsValue } = useProfileAction();
  const defaultProfile = cloneDeep(useProfileStore.getState().defaultProfile);
  const [visible, setVisible] = useState(false);
  const { openConfirm, openAlert, openConfigLoading, closeAll, close: closeModal } = useModal();
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const toggle = () => setVisible((v) => !v);
  const [linksIconData, setLinksIconData] = useState<string[]>([]);

  const [profileList, setProfileList] = useState<string[]>([]);
  const handleExportProfile = () => {
    if (currentModelID && currentConfigFileName) {
      try {
        dialog
          .showSaveDialog({
            title: 'Save',
            filters: [{ name: 'Mouse Profile Files', extensions: ['mpf'] }],
          })
          .then(function (result) {
            if (!result.canceled) {
              exportProfile(currentModelID, currentConfigFileName, profile, result.filePath, () => {});
            }
          });
      } catch (error) {
        console.error('Export profile error:', error);
      }
    }
  };
  const fileMenu = [
    {
      label: t('delete_profile_file'),
      value: 'delete',
      onClick: () => {
        handleDeleteProfile(currentConfigFileName);
      },
    },

    {
      label: t('rename_profile_file'),
      value: 'delete',
      onClick: () => {
        handleRenameProfile(currentConfigFileName);
      },
    },

    {
      label: t('export_profile_file'),
      value: 'export',
      onClick: () => handleExportProfile(),
    },
  ];
  const handleRenameProfile = (oldFileName?: string) => {
    openConfirm({
      title: t('rename_profile_file'),
      content: '',
      onOk: (newFileName) => {
        if (newFileName && profileList.includes(newFileName.trim())) {
          toast.error(t('profile_file_already_exists'));
          return;
        }
        RenameProfile(currentModelID, oldFileName, newFileName, () => {
          _getProfileList();
        });
      },
    });
  };
  const handleDeleteProfile = (fileName?: string) => {
    if (profileList.length <= 1) {
      openAlert({
        title: t('warning!'),
        content: t('cannot_delete_last_profile'),
      });
      return;
    }
    const delFileNameIdx = profileList.findIndex((name) => name == fileName) || 0;
    const newSelectFileName = profileList[delFileNameIdx == 0 ? 1 : delFileNameIdx - 1];
    openAlert({
      title: t('confirm_delete_profile'),
      content: t('confirm_delete_profile_desc', { profile: fileName || currentConfigFileName }),
      onOk: () => {
        DelProfile(currentModelID, currentConfigFileName, (success) => {
          if (success) {
            _getProfileList();
            handleSelectProfile(newSelectFileName);
          } else {
            console.error('Delete profile failed');
          }
        });
      },
    });
  };

  const handleCreateProfile = () => {
    openConfirm({
      title: t('create_profile'),
      content: '',
      onOk: (fileName) => {
        if (!fileName) return;
        if (profileList.includes(fileName)) {
          console.error('Profile file already exists');
          return;
        }
        AddProfile(currentModelID, fileName, async () => {
          await _getProfileList();
          setCurrentProfile(currentModelID, fileName, defaultProfile, () => {
            handleSelectProfile(fileName);
          });
        });
      },
    });
  };
  const handleSelectProfile = (fileName: string) => {
    if (fileName === currentConfigFileName) {
      return;
    }

    const _loading = openConfigLoading({ proccess: 0 });
    setCurrentConfigFileName(fileName);
    setSelectProfile(currentModelID, fileName);
    getProfileByName(currentModelID, fileName, (data) => {
      if (data) {
        // 先更新本地状态
        setProfile(data);

        // 在setCurrentProfile的回调中应用配置到鼠标，确保配置保存成功后再同步
        setCurrentProfile(currentModelID, fileName, data, (success) => {
          if (success) {
            // 配置保存成功后，将配置应用到鼠标设备
            handleApplyProfileToMouse(data);
            console.log('配置文件已成功同步到鼠标设备');
          } else {
            console.error('配置文件同步到鼠标设备失败');
          }
        });
      } else {
        console.error('获取配置文件失败');
      }
      closeModal(_loading);
    });
  };

  // 增强handleApplyProfileToMouse函数，确保设置按正确顺序应用，特别是按键配置
  const handleApplyProfileToMouse = (profile: Profile) => {
    const { LEDEffect, DPIs, USBReports, WLReports, AdvanceSetting, KeySet } = profile;
    const { DPILevels } = currentDevice?.Info || {};

    try {
      // 1. 先发送按键配置到设备，确保按键功能正确同步
      // 创建一个只包含KeySet的简化profile对象，专门用于按键配置同步
      const keyProfile = {
        ...profile,
        KeySet: KeySet || [], // 确保KeySet存在
      };

      // 首先应用按键配置，这是最关键的一步
      apply(path, keyProfile, (success) => {
        if (success) {
          console.log('按键配置已成功发送到鼠标设备');

          // 2. 设置灯光效果
          if (LEDEffect) {
            setLE(path, LEDEffect);
          }

          // 3. 设置回报率
          if (USBReports || WLReports) {
            setReportRate(path, {
              USBReports: USBReports || [],
              WLReports: WLReports || [],
            });
          }

          // 4. 设置高级设置
          if (AdvanceSetting) {
            setAdvanceSetting(path, AdvanceSetting);
          }

          // 5. 最后设置DPI，确保不会被其他设置覆盖
          setTimeout(() => {
            setDPI(
              path,
              mode,
              {
                DPILevels: DPILevels || [],
                DPIs: resetDPIsValue(DPIs || []),
              },
              () => {
                console.log('DPI设置已应用到鼠标设备');

                // 6. 配置全部应用完成后，再次确认按键配置，确保切换稳定
                setTimeout(() => {
                  apply(path, keyProfile, () => {
                    console.log('按键配置再次确认已应用到鼠标设备');
                  });
                }, 200);
              }
            );
          }, 100);
        } else {
          console.error('按键配置同步到鼠标设备失败');
        }
      });
    } catch (error) {
      console.error('应用配置到鼠标设备时发生错误:', error);
    }
  };
  const _getProfileList = () => {
    GetProfiles(currentModelID, (profileList) => {
      console.log('Profile list:', profileList);
      setProfileList(profileList);
      getSelectProfile(currentModelID, (profileName) => {
        setCurrentConfigFileName(profileName);
        if (profile.Name !== profileName) {
          hookSelectProfile(profileName);
        }
      });
    });
  };
  const handleAddLinkGame = () => {
    dialog
      .showOpenDialog({
        title: 'Open',
        filters: [{ name: 'Executables', extensions: ['exe'] }],
      })
      .then(function (result) {
        if (!result || !result.filePaths || result.filePaths.length == 0) return;
        const newProfile = cloneDeep({ ...profile, LinkApps: (profile?.LinkApps || []).concat(result.filePaths[0]) });
        setCurrentProfile(currentModelID, currentConfigFileName, newProfile, () => {
          setProfile(newProfile);
        });
      });
  };

  const handleDeleteLinkGame = (idx) => {
    const _LinkApps = cloneDeep(profile?.LinkApps || []);
    _LinkApps.splice(idx, 1);
    const newProfile = cloneDeep({ ...profile, LinkApps: _LinkApps });
    setCurrentProfile(currentModelID, currentConfigFileName, newProfile, () => {
      setProfile(newProfile);
    });
  };

  const handleImportProfile = () => {
    dialog
      .showOpenDialog({
        title: 'Open',
        filters: [{ name: 'Mouse Profile Files', extensions: ['mpf'] }],
      })
      .then(function (result) {
        if (!result || result.canceled || !result.filePaths || result.filePaths.length === 0) return;
        const filePath = result.filePaths[0];
        importProfile(currentModelID, result.filePaths[0], (payload) => {
          if (!payload) {
            toast.error(t('import_profile_failed'));
            console.error('importProfile returned empty payload for', filePath);
            return;
          }
          let currentProfileName = (payload.Name || 'profile').trim() || 'profile';
          let idx = 1;
          while (profileList.includes(currentProfileName)) {
            currentProfileName = `${payload.Name}_${idx}`;
            idx++;
          }
          AddProfile(currentModelID, currentProfileName, async () => {
            await _getProfileList();
            setCurrentProfile(currentModelID, currentProfileName, payload, () => {
              handleSelectProfile(currentProfileName);
            });
          });
        });
      });
  };

  useEffect(() => {
    if (!currentDevice) {
      setVisible(false);
    }
  }, [currentDevice]);
  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const drawer = drawerRef.current;
    const header = document.querySelector('.header-center');

    if (visible) {
      _getProfileList();
      header?.setAttribute('data-drag-disabled', 'true');
      header?.setAttribute('style', '-webkit-app-region: no-drag');

      if (drawer) {
        setTimeout(() => {
          drawer.style.setProperty('-webkit-app-region', 'no-drag');
          drawer.style.zIndex = '999';

          void drawer.offsetHeight;
          drawer.style.transform = 'translateZ(0)';
          console.log('Drawer styles applied for visibility');
        }, 1000);
      }
    } else {
      header?.setAttribute('style', '-webkit-app-region: drag');
      drawer?.removeAttribute('style');
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    setLinksIconData([]);
    (profile?.LinkApps || []).forEach((path: string) => {
      getExeIcon(path, (iconBase64Data) => {
        setLinksIconData((prev) => [...prev, 'data:image/png;base64,' + iconBase64Data]);
      });
    });
  }, [currentModelID, profile?.LinkApps, visible]);
  useEffect(() => {
    if (currentModelID) {
      _getProfileList();
    }
  }, [currentModelID]);
  return (
    <ProfileDrawerContext.Provider value={{ open, close, toggle }}>
      {children}
      <Portal>
        {visible && (
          <>
            <div className={`drawer-overlay ${visible ? 'show' : ''}`} onClick={close}></div>
            <div className={`drawer drawer-profile ${visible ? 'open' : ''}`} ref={drawerRef}>
              <div className="profile-container">
                <div className="back-content">
                  <div className="content-back-btn" onClick={close}>
                    <HoverImage src={back1} hoverSrc={back2} alt="Logo" className="back-btn-icon" />
                    {t('back_to_home')}
                  </div>
                </div>
                <div className="profile-container-center">
                  <div className="profile-header">
                    <div>{t('profile_configuration_list')}</div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div onClick={() => handleImportProfile()} className="flex items-center">
                        <HoverImage
                          src={ic_save}
                          hoverSrc={ic_save}
                          alt="ic_import"
                          className="cursor-pointer back-btn-icon"
                        />
                      </div>
                      <div onClick={() => handleDeleteProfile(currentConfigFileName)} className="flex items-center">
                        <HoverImage
                          src={ic_delete}
                          hoverSrc={ic_delete}
                          alt="ic_delete"
                          className="cursor-pointer back-btn-icon"
                        />
                      </div>
                      <div onClick={() => handleCreateProfile()} className="flex items-center">
                        <HoverImage
                          src={ic_add}
                          hoverSrc={ic_add}
                          alt="ic_add"
                          className="cursor-pointer back-btn-icon"
                        />
                      </div>
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
                                icon={
                                  <HoverImage
                                    src={ic_more}
                                    hoverSrc={ic_more}
                                    alt="ic_more"
                                    className="back-btn-icon"
                                  />
                                }
                                menu={fileMenu}
                              />
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="profile-game">
                  <div>{t('link_profile_with_game')}</div>
                  <div className="sub-title">{t('link_profile_game_list')}</div>
                  <div className="profile-game-list">
                    {linksIconData.map((app, idx) => {
                      return (
                        <div className="profile-game-item" key={app + idx}>
                          <img src={app} alt="" />
                          <div className="profile-game-icon-close" onClick={() => handleDeleteLinkGame(idx)}>
                            <img src={ic_close} alt="" />
                          </div>
                        </div>
                      );
                    })}
                    <div className="profile-game-item-add" onClick={() => handleAddLinkGame()}>
                      <img src={ic_addv2} alt="" className="profile-game-icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Portal>
    </ProfileDrawerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProfileDrawer = () => {
  const ctx = useContext(ProfileDrawerContext);
  if (!ctx) throw new Error('useSettingsDrawer must be used inside SettingsDrawerProvider');
  return ctx;
};
