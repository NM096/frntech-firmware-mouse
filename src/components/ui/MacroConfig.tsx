import HoverImage from '../common/HoverImage';
import Dropdown from '../common/Dropdown';
import CustomRadio from '../common/CustomRadio';
import btn_up_2 from '@/assets/btn_up_2.png';
import btn_up_1 from '@/assets/btn_up_1.png';
import btn_down_1 from '@/assets/btn_down_1.png';
import btn_down_2 from '@/assets/btn_down_2.png';
import delete_macro_action_1 from '@/assets/delete_macro_action_1.png';
import delete_macro_action_2 from '@/assets/delete_macro_action_2.png';

import ic_save from '@/assets/ic_save.png';
import ic_clear from '@/assets/clear.png';
import ic_delete from '@/assets/delete.png';
import ic_add from '@/assets/ic_add.png';
import ic_more from '@/assets/ic_more.png';
import ic_move from '@/assets/ic_move.png';
import ic_play from '@/assets/play.png';

import ic_stop from '@/assets/stopPlay.png';
import { useEffect, useState } from 'react';
import { useGlobalClickBlocker } from '@/hooks/useGlobalClickBlocker';
import {
  getMacroCategorys,
  addMacroCategory,
  getMacros,
  delMacro,
  importMacro,
  exportMacro,
  readMacro,
  saveMacro,
  addMacro,
} from '@/utils/driver';
import IconMenu from '../common/IconMenu';
import { useModal } from '../common/ModalContext';
import Keys from '@/config/keys.json';
import { toast } from 'sonner';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useMacroRecorder } from '@/hooks/useMacroRecorder';
import MacroActionList from '../common/MacroActionList';
import { KeyFormatter } from '@/utils/common';
import { useTranslation } from 'react-i18next';
import { useAllowClick } from '@/hooks/useAllowClick';
import { useMacroStore } from '@/store/macroStore';
import useActionMacroFile from '@/hooks/useActionMacroFile';
const { dialog } = require('electron').remote;

export interface MacroEvent {
  type: 'KeyDown' | 'KeyUp' | 'MouseDown' | 'MouseUp' | 'Delay';
  name: string;
  code: string;
}

const MacroConfig = () => {
  const { t } = useTranslation();
  const { openConfirm, openAlert } = useModal();
  const { path } = useBaseInfoStore();
  const [category, setCategory] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [currentMacroFile, setCurrentMacroFile] = useState<string>('');
  const [macroFiles, setMacroFiles] = useState<string[]>([]);
  const { Mouse } = Keys;
  const [delayMode, setDelayMode] = useState<'record' | 'default' | 'min'>('record');
  const [minDelay, setMinDelay] = useState(10);

  const [recording, setRecording] = useState(false);
  const [openRecords, setOpenRecords] = useState(false);
  const { records, clearRecords, setRecords, stop } = useMacroRecorder(recording, openRecords, delayMode, minDelay);
  const [recordedActions, setRecordedActions] = useState<MacroEvent[]>([]);
  const {
    recordList,
    currentStepIdx,
    setRecordList,
    moveUpStep,
    moveDownStep,
    deleteStep,
    selectStep,
    updateStepDelay,
    updateStepKeyboard,
  } = useActionMacroFile();

  useGlobalClickBlocker();
  const { startRecording, stopRecording } = useMacroStore();
  const handleSwitchCategory = (category: string) => {
    setCurrentCategory(category);
    getMacros(category, (payload) => {
      setMacroFiles(payload);
      setCurrentMacroFile(payload[0] || '');
    });
  };
  const handleCreateCategory = () => {
    openConfirm({
      title: t('create_macro_group'),
      content: t('macro_group_name'),
      onOk: (value) => {
        addMacroCategory(value, (payload) => {
          if (category.includes(value || '')) {
            toast.error(t('macro_group_exists'));
            return;
          }
          if (payload) {
            getMacroCategorys((payload) => {
              setCategory(payload);
              handleSwitchCategory(value || '');
              console.log('category', category);
              console.log('currentCategory', currentCategory);
            });
          }
        });
      },
    });
  };
  const handleDeleteCategory = () => {
    if (!currentCategory) return;
    openAlert({
      title: t('warning'),
      content: t('confirm_delete_macro_group'),
      onOk: () => {
        delMacro(currentCategory, currentMacroFile, (payload) => {
          if (payload) {
            getMacroCategorys((payload) => {
              setCategory(payload);
              setCurrentCategory('');
              setCurrentMacroFile('');
              setMacroFiles([]);
            });
          }
        });
      },
    });
  };
  const handleRenameCategory = () => {
    openConfirm({
      title: t('rename_macro_group'),
      content: t('macro_group_name'),
      onOk: (value) => {
        addMacroCategory(value, (payload) => {
          if (payload) {
            getMacroCategorys((payload) => {
              setCategory(payload);
            });
          }
        });
      },
    });
  };
  const handleImportCategory = () => {
    importMacro(path);
  };
  const handleExportCategory = () => {
    if (!currentCategory) return;
    // exportMacro(currentCategory, path);
  };

  const handleRenameMacroFile = () => {
    openConfirm({
      title: t('rename_macro_file'),
      content: t('macro_file_name'),
      onOk: (value) => {
        addMacroCategory(value, (payload) => {
          if (payload) {
            getMacros(currentCategory, (payload) => {
              setMacroFiles(payload);
            });
          }
        });
      },
    });
  };
  const handleCreateMacroFile = () => {
    openConfirm({
      title: t('create_macro_file'),
      content: t('macro_file_name'),
      onOk: (value) => {
        addMacro(currentCategory, value, (payload) => {
          if (macroFiles.includes(value || '新宏文件')) {
            toast.error(t('macro_file_exists'));
            return;
          }
          if (payload) {
            addMacro(currentCategory, currentMacroFile);
            setMacroFiles([...macroFiles, value || '新宏文件']);
            setCurrentMacroFile(value || '新宏文件');
          }
        });
      },
    });
  };
  const handleDeleteMacroFile = () => {
    if (!currentMacroFile && !currentCategory) return;
    openAlert({
      title: t('warning'),
      content: t('confirm_delete_macro_file'),
      onOk: () => {
        delMacro(currentCategory, currentMacroFile, (payload) => {
          if (payload) {
            getMacros(currentCategory, (payload) => {
              setMacroFiles(payload);
            });
          }
        });
      },
    });
  };

  const handleSave = () => {
    setRecording(false);
    setOpenRecords(false);
    stop();
    saveMacro(
      currentCategory,
      currentMacroFile,
      { Content: KeyFormatter.capitalizeKeys(recordedActions) },
      (payload) => {
        if (payload) {
          toast.success(t('save_success'));
          getMacros(currentCategory, (payload) => {
            setMacroFiles(payload);
          });
        } else {
          toast.error(t('save_failed'));
        }
      }
    );
  };
  const handleCancel = () => {
    setRecording(false);
    setOpenRecords(false);
    readMacro(currentCategory, currentMacroFile, (data) => {
      if (data && Array.isArray(data.Content) && data.Content.length > 0) {
        setRecords(KeyFormatter.lowercaseKeys(data.Content) || []);
      } else {
        setRecordedActions([]);
      }
      console.log('recordedActions', recordedActions);
    });
  };
  const handleExportMacroFile = () => {
    if (!currentCategory && !currentMacroFile) return;

    dialog
      .showSaveDialog({
        title: 'Save',
        filters: { name: 'Key Profile Files', extensions: ['kpf'] },
      })
      .then(function (result) {
        exportMacro(
          currentCategory,
          { Content: KeyFormatter.capitalizeKeys(recordedActions) },
          result.filePath,
          (payload) => {
            if (macroFiles.includes(currentMacroFile)) {
              toast.success(t('export_success'));
              console.log(payload);
              setCurrentCategory(currentCategory);
              setCurrentMacroFile(currentMacroFile);
            }
          }
        );
      });
  };
  const handleImportMacroFile = () => {
    dialog
      .showOpenDialog({
        title: 'Open',
        filters: [{ name: 'Key Profile Files', extensions: ['kpf'] }],
      })
      .then(function (result) {
        importMacro(result.filePaths[0]);
      });
  };

  const listenerMacroStepFocus = (event: KeyboardEvent) => {
    updateStepKeyboard(event);
  };
  useEffect(() => {
    getMacroCategorys((CategoryList) => {
      setCategory(CategoryList);
      setCurrentCategory(CategoryList[0] || '');
    });
  }, []);

  useEffect(() => {
    getMacros(currentCategory, (payload) => {
      setCurrentMacroFile(payload[0] || '');
      setMacroFiles(payload);
    });
  }, [currentCategory]);

  useEffect(() => {
    if (currentMacroFile) {
      readMacro(currentCategory, currentMacroFile, (data) => {
        if (data && Array.isArray(data.Content) && data.Content.length > 0) {
          console.log('data.Content', KeyFormatter.lowercaseKeys(data.Content));
          // setRecordedActions(KeyFormatter.lowercaseKeys(data.Content) || []);
          setRecords(KeyFormatter.lowercaseKeys(data.Content) || []);
          setRecordList(KeyFormatter.lowercaseKeys(data.Content) || []);
        } else {
          setRecordedActions([]);
        }
        console.log('recordedActions', recordedActions);
      });
    }
  }, [currentMacroFile]);
  useEffect(() => {
    setRecordedActions(records);
  }, [records]);
  useEffect(() => {
    setRecordedActions(recordList);
    console.log('recordList changed', recordList);
  }, [recordList]);

  const categoryMenu = [
    // {
    //   label: '重命名宏组',
    //   value: 'rename',
    //   onClick: handleRenameCategory,
    // },
    // {
    //   label: '导入宏组',
    //   value: 'import',
    //   onClick: handleImportCategory,
    // },
    // {
    //   label: '导出宏组',
    //   value: 'export',
    //   onClick: handleExportCategory,
    // },
  ];
  const macroMenu = [
    // {
    //   label: '重命名宏文件',
    //   value: 'rename',
    //   onClick: handleRenameMacroFile,
    // },
    {
      label: t('delete_macro_file'),
      value: 'delete',
      onClick: handleDeleteMacroFile,
    },
    {
      label: t('import_macro_file'),
      value: 'import',
      onClick: handleImportMacroFile,
    },
    {
      label: t('export_macro_file'),
      value: 'export',
      onClick: handleExportMacroFile,
    },
  ];

  useEffect(() => {
    console.log('recordList', recordList);
    console.log('currentStepIdx', currentStepIdx);
  }, [recordList, currentStepIdx]);
  return (
    <div className="macro-config">
      <div className="macro-item-left">
        <div className="macro-btn-group">
          <span>{t('macro_group')}</span>
          <div className="macro-btn-group">
            <IconMenu
              icon={<HoverImage src={ic_save} hoverSrc={ic_save} alt="ic_save" className="back-btn-icon" />}
              menu={categoryMenu}
            />
            <HoverImage
              src={ic_delete}
              hoverSrc={ic_delete}
              alt="ic_delete"
              className="back-btn-icon"
              onClick={() => handleDeleteCategory()}
            />
            <HoverImage
              src={ic_add}
              hoverSrc={ic_add}
              alt="ic_add"
              className="back-btn-icon"
              onClick={() => handleCreateCategory()}
            />
          </div>
        </div>
        <Dropdown
          borderColor="#ff7b00"
          options={category}
          onChange={(e) => {
            handleSwitchCategory(e);
          }}
          defaultValue={currentCategory}
          size="small"
        />
        <div className="macro-btn-group">
          <span>{t('macro_name')}</span>
          <div className="macro-btn-group">
            <HoverImage
              src={ic_save}
              hoverSrc={ic_save}
              alt="ic_save"
              className="back-btn-icon"
              onClick={() => handleImportCategory()}
            />
            <HoverImage
              src={ic_delete}
              hoverSrc={ic_delete}
              alt="ic_delete"
              className="back-btn-icon"
              onClick={() => handleDeleteMacroFile()}
            />
            <HoverImage
              src={ic_add}
              hoverSrc={ic_add}
              alt="ic_add"
              className="back-btn-icon"
              onClick={() => handleCreateMacroFile()}
            />
          </div>
        </div>
        <div className="macro-file-group">
          <ul>
            {macroFiles &&
              macroFiles.map((macro: string) => (
                <li
                  className={`${currentMacroFile === macro ? 'active' : ''} macro-file-item`}
                  key={macro}
                  onClick={() => setCurrentMacroFile(macro)}
                >
                  <span>{macro}</span>
                  <IconMenu
                    icon={<HoverImage src={ic_more} hoverSrc={ic_more} alt="ic_more" className="back-btn-icon" />}
                    menu={macroMenu}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="macro-item-content">
        <div className="macro-content-header">
          {recording ? (
            <div
              className="macro-record-btn"
              data-allow-click
              onClick={() => {
                setRecording(false);

                stopRecording();
              }}
              onMouseEnter={() => {
                setOpenRecords(false);
              }}
              onMouseLeave={() => {
                setOpenRecords(true);
              }}
            >
              <HoverImage src={ic_stop} hoverSrc={ic_stop} alt="Logo" className="back-btn-icon" />
              {t('stop_recording')}
            </div>
          ) : (
            <div
              className="macro-record-btn"
              onClick={() => {
                if (currentMacroFile) {
                  // setRecords(currentMacroFile || [])
                  setRecording(true);
                  setOpenRecords(true);
                  startRecording();
                }
              }}
            >
              <HoverImage src={ic_play} hoverSrc={ic_play} alt="Logo" className="back-btn-icon" />
              {t('start_recording')}
            </div>
          )}
          <HoverImage
            src={delete_macro_action_1}
            hoverSrc={delete_macro_action_2}
            alt="Logo"
            className="back-btn-icon"
            onClick={() => deleteStep()}
          />
          <HoverImage
            src={btn_up_1}
            hoverSrc={btn_up_2}
            alt="Logo"
            className="back-btn-icon"
            onClick={() => moveUpStep()}
          />
          <HoverImage
            src={btn_down_1}
            hoverSrc={btn_down_2}
            alt="Logo"
            className="back-btn-icon"
            onClick={() => moveDownStep()}
          />
          <div
            onMouseEnter={() => {
              setOpenRecords(false);
            }}
            onMouseLeave={() => {
              setOpenRecords(true);
            }}
          >
            <HoverImage
              src={ic_clear}
              hoverSrc={ic_clear}
              alt="Logo"
              className="back-btn-icon"
              onClick={() => clearRecords()}
            />
          </div>
          {/* <HoverImage src={ic_move} hoverSrc={ic_move} alt="Logo" className="back-btn-icon" />
          <div>
            X:
            <input
              type="text"
              style={{ width: '50px', border: '0px', backgroundColor: 'white', color: 'black', textAlign: 'center' }}
            />
          </div>
          <div>
            Y:
            <input
              type="text"
              style={{ width: '50px', border: '0px', backgroundColor: 'white', color: 'black', textAlign: 'center' }}
            />
          </div> */}
        </div>
        <ul className="macro-content-body">
          <MacroActionList
            events={recordedActions}
            delayMode={delayMode}
            showDelay={false}
            onSelectStep={selectStep}
            selectIndex={currentStepIdx}
          />
        </ul>
      </div>
      <div className="macro-item-right">
        <div>{t('recording_delay_mode')}:</div>
        <ul
          className="macro-delay-mode"
          onMouseEnter={() => {
            setOpenRecords(false);
          }}
          onMouseLeave={() => {
            setOpenRecords(true);
          }}
        >
          <li>
            <CustomRadio customSize="small" checked={delayMode === 'record'} onChange={() => setDelayMode('record')} />
            {t('recording_delay')}
          </li>
          <li>
            <CustomRadio
              customSize="small"
              checked={delayMode === 'default'}
              onChange={() => setDelayMode('default')}
            />
            <input
              type="number"
              disabled={delayMode !== 'default'}
              min={10}
              onChange={(e) => setMinDelay(Number(e.target.value))}
              value={minDelay}
              style={{ width: '50px', backgroundColor: 'white', color: 'black', textAlign: 'center', border: '0px' }}
            />
            ms{t('default')}
          </li>
          <li>
            <CustomRadio customSize="small" checked={delayMode === 'min'} onChange={() => setDelayMode('min')} />
            {t('min_delay')}
          </li>
        </ul>
        {currentStepIdx !== null && (
          <div>
            <div style={{ margin: '10px 0' }}>按键</div>
            {['MouseDown', 'MouseUp'].includes(recordedActions[currentStepIdx]?.type) ? (
              <Dropdown
                borderColor="#ff7b00"
                options={['mouse_kf_mouse_left', 'mouse_kf_mouse_right']}
                defaultValue={recordedActions[currentStepIdx]?.name || 'mouse_kf_mouse_left'}
                onChange={() => {}}
                size="small"
              />
            ) : (
              <input
                type="text"
                value={recordedActions[currentStepIdx]?.name}
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  color: 'black',
                  textAlign: 'center',
                  border: '0px',
                }}
                onFocus={() => {
                  document.addEventListener('keydown', listenerMacroStepFocus);
                }}
                onBlur={() => {
                  console.log('输入框失去焦点');
                  document.removeEventListener('keydown', listenerMacroStepFocus);
                }}
              />
            )}

            <div style={{ margin: '10px 0' }}>延迟(ms) </div>
            <input
              type="text"
              value={recordedActions[currentStepIdx + 1]?.code}
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: 'black',
                textAlign: 'center',
                border: '0px',
              }}
              onChange={(e) => {
                updateStepDelay(Number(e.target.value));
              }}
            />
          </div>
        )}
        <div
          className="macro-action-btn"
          onClick={() => handleSave()}
          onMouseEnter={() => {
            setOpenRecords(false);
          }}
          onMouseLeave={() => {
            setOpenRecords(true);
          }}
        >
          {t('confirm')}
        </div>
        <div
          className="macro-action-btn"
          onClick={() => handleCancel()}
          onMouseEnter={() => {
            setOpenRecords(false);
          }}
          onMouseLeave={() => {
            setOpenRecords(true);
          }}
        >
          {t('cancel')}
        </div>
      </div>
    </div>
  );
};
export default MacroConfig;
