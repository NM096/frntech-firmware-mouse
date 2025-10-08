import React, { createContext, useEffect, useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import back2 from '@/assets/back_device_2.png';
import back1 from '@/assets/back_device_1.png';
import ic_delete from '@/assets/delete.png';
import ic_add from '@/assets/ic_add.png';
import ic_more from '@/assets/ic_more.png';
import IconMenu from '../common/IconMenu';
import ic_save from '@/assets/ic_save.png';
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
} from '@/utils/driver';
import HoverImage from '@/components/common/HoverImage';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useModal } from './ModalContext';
import { toast } from 'sonner';
import { useProfileStore } from '@/store/useProfile';
import type { Profile } from '@/types/profile';
import Portal from './Portal';
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
  const { defaultProfile, setProfile, updateProfile } = useProfileStore();
  const [visible, setVisible] = useState(false);
  const { openConfirm, openAlert } = useModal();
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const toggle = () => setVisible((v) => !v);

  const [profileList, setProfileList] = useState<string[]>([]);
  const fileMenu = [
    {
      label: t('delete_profile_file'),
      value: 'delete',
      onClick: () => {
        handleDeleteProfile();
      },
    },

    {
      label: t('export_profile_file'),
      value: 'export',
      onClick: () => {
        if (currentModelID && currentConfigFileName) {
          try {
            // 先获取配置文件内容
            getProfileByName(currentModelID, currentConfigFileName, (profileData) => {
              if (profileData) {
                try {
                  console.log('Profile data retrieved successfully:', profileData);

                  // 转换为JSON字符串
                  const jsonString = JSON.stringify(profileData, null, 2);
                  console.log('JSON string length:', jsonString.length);

                  // 创建Blob对象
                  const blob = new Blob([jsonString], { type: 'application/json' });

                  // 创建下载链接
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = currentConfigFileName || 'profile.json';

                  // 添加到文档并触发点击
                  document.body.appendChild(link);
                  link.click();

                  // 清理
                  setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }, 100);
                } catch (error) {
                  console.error('Export profile error during file creation:', error);
                }
              } else {
                console.error('Failed to get profile data');
              }
            });
          } catch (error) {
            console.error('Export profile error:', error);
          }
        }
      },
    },
  ];

  const handleDeleteProfile = (value?: string) => {
    if (profileList.length <= 1) {
      openAlert({
        title: t('warning!'),
        content: t('cannot_delete_last_profile'),
      });
      return;
    }
    openAlert({
      title: t('confirm_delete_profile'),
      content: t('confirm_delete_profile_desc', { profile: value || currentConfigFileName }),
      onOk: () => {
        DelProfile(currentModelID, currentConfigFileName, (success) => {
          if (success) {
            _getProfileList();
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
      onOk: (value) => {
        if (!value) return;
        if (profileList.includes(value)) {
          console.error('Profile file already exists');
          return;
        }
        AddProfile(currentModelID, value, () => {
          setCurrentProfile(currentModelID, value, defaultProfile);
          _getProfileList();
          setCurrentConfigFileName(value);
        });
      },
    });
  };
  const handleSelectProfile = (profile: string) => {
    setCurrentConfigFileName(profile);
    getProfileByName(currentModelID, profile, (data) => {
      if (data) {
        // 先更新本地状态
        setProfile(data);

        // 在setCurrentProfile的回调中应用配置到鼠标，确保配置保存成功后再同步
        setCurrentProfile(currentModelID, profile, data, (success) => {
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
                DPIs: DPIs || [],
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
    });
  };

  const handleImportProfile = () => {
    // 创建一个隐藏的文件输入元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.accept = '.json'; // 限制只能选择JSON文件

    // 设置文件选择事件处理
    fileInput.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && currentModelID) {
        // 创建FileReader来读取文件内容
        const reader = new FileReader();

        reader.onload = (event) => {
          try {
            // 尝试解析文件内容
            const fileContent = event.target?.result as string;
            const profileData = JSON.parse(fileContent);

            // 直接使用文件名作为配置名称
            const profileName = file.name.replace('.json', '');

            console.log('Importing profile:', profileName, profileData);

            // 首先检查配置名称是否已存在
            if (profileList.includes(profileName)) {
              console.error('Profile name already exists:', profileName);
              return;
            }

            // 先添加配置文件
            AddProfile(currentModelID, profileName, () => {
              // 然后设置配置内容
              setCurrentProfile(currentModelID, profileName, profileData, (success) => {
                if (success) {
                  _getProfileList(); // 重新获取配置列表
                  console.log('Profile imported successfully:', profileName);
                } else {
                  console.error('Failed to set profile content');
                }
              });
            });
          } catch (error) {
            console.error('Failed to read or parse profile file:', error);
          }
        };

        reader.onerror = () => {
          console.error('Error reading file');
        };

        // 以文本形式读取文件
        reader.readAsText(file);
      }
    });

    // 添加到DOM并触发点击
    document.body.appendChild(fileInput);
    fileInput.click();

    // 清理
    setTimeout(() => {
      document.body.removeChild(fileInput);
    }, 100);
  };
  useEffect(() => {
    if (currentModelID) {
      _getProfileList();
    }
  }, [currentModelID]);
  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const drawer = drawerRef.current;
    const header = document.querySelector('.header-center');

    if (visible) {
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
                    <div>配置列表</div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                      <div onClick={() => handleImportProfile()} className="flex items-center">
                        <HoverImage
                          src={ic_save}
                          hoverSrc={ic_save}
                          alt="ic_import"
                          className="back-btn-icon cursor-pointer"
                        />
                      </div>
                      <div onClick={() => handleDeleteProfile()} className="flex items-center">
                        <HoverImage
                          src={ic_delete}
                          hoverSrc={ic_delete}
                          alt="ic_delete"
                          className="back-btn-icon cursor-pointer"
                        />
                      </div>
                      <div onClick={() => handleCreateProfile()} className="flex items-center">
                        <HoverImage
                          src={ic_add}
                          hoverSrc={ic_add}
                          alt="ic_add"
                          className="back-btn-icon cursor-pointer"
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
                <div className="profile-game"></div>
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
