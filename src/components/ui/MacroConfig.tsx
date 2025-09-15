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

const { dialog } = require('electron').remote;

export interface MacroEvent {
  type: 'KeyDown' | 'KeyUp' | 'MouseDown' | 'MouseUp' | 'Delay';
  name: string;
  code: string;
}

const MacroConfig = () => {
  const { openConfirm, openAlert } = useModal();
  const { path } = useBaseInfoStore();
  const [macroList, setMacroList] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [currentMacroFile, setCurrentMacroFile] = useState<string>('');
  const [macroFiles, setMacroFiles] = useState<string[]>([]);
  const { Mouse } = Keys;
  const [delayMode, setDelayMode] = useState<'record' | 'default' | 'min'>('record');
  const [minDelay, setMinDelay] = useState(10);

  const [recording, setRecording] = useState(false);
  const [openRecords, setOpenRecords] = useState(false);
  const { records, stop, clearRecords, setRecords } = useMacroRecorder(recording, openRecords, delayMode, minDelay);
  const [recordedActions, setRecordedActions] = useState<MacroEvent[]>([]);

  useEffect(() => {
    setRecordedActions(records);
  }, [records]);

  const handleClearRecords = () => {
    clearRecords();
    setRecordedActions(stop());
  };
  const handleStopRecords = () => {
    setRecording(false);
    setRecordedActions(stop());
  };

  const handleSwitchCategory = (category: string) => {
    setCurrentCategory(category);
    getMacros(category, (payload) => {
      setMacroFiles(payload);
      setCurrentMacroFile(payload[0] || '');
    });
  };
  const handleCreateCategory = () => {
    openConfirm({
      title: '增加宏组',
      content: '宏组名称',
      onOk: (value) => {
        addMacroCategory(value, (payload) => {
          if (macroList.includes(value || '新宏组')) {
            toast.error('宏组已存在');
            return;
          }
          if (payload) {
            setMacroList([...macroList, value || '新宏组']);
            setCurrentCategory(value || '新宏组');
          }
        });
      },
    });
  };
  const handleDeleteCategory = () => {
    if (!currentCategory) return;
    openAlert({
      title: '警告',
      content: '确认删除该宏组吗？',
      onOk: () => {
        delMacro(currentCategory, currentMacroFile, (payload) => {
          if (payload) {
            getMacroCategorys((payload) => {
              setMacroList(payload);
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
      title: '重命名宏组',
      content: '宏组名称',
      onOk: (value) => {
        addMacroCategory(value, (payload) => {
          if (payload) {
            getMacroCategorys((payload) => {
              setMacroList(payload);
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
      title: '重命名宏文件',
      content: '宏文件名称',
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
      title: '增加宏文件',
      content: '宏文件名称',
      onOk: (value) => {
        addMacro(currentCategory, value, (payload) => {
          if (macroFiles.includes(value || '新宏文件')) {
            toast.error('宏文件已存在');
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
      title: '警告',
      content: '确认删除该宏文件吗？',
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
    saveMacro(
      currentCategory,
      currentMacroFile,
      { Content: KeyFormatter.capitalizeKeys(recordedActions) },
      (payload) => {
        if (payload) {
          toast.success('保存成功');
          getMacros(currentCategory, (payload) => {
            setMacroFiles(payload);
          });
        } else {
          toast.error('保存失败');
        }
      }
    );
  };
  const handleCancel = () => {};
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
              toast.success('导出成功');
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
  useEffect(() => {
    getMacroCategorys((payload) => {
      setMacroList(payload);
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
      readMacro(currentCategory, currentMacroFile, () => {
        readMacro(currentCategory, currentMacroFile, (data) => {
          if (data && Array.isArray(data.Content) && data.Content.length > 0) {
            setRecordedActions(KeyFormatter.lowercaseKeys(data.Content) || []);
          } else {
            setRecordedActions([]);
          }

          console.log('recordedActions', recordedActions);
        });
      });
    }
  }, [currentMacroFile]);

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
      label: '删除宏文件',
      value: 'delete',
      onClick: handleDeleteMacroFile,
    },
    {
      label: '导入宏文件',
      value: 'import',
      onClick: handleImportMacroFile,
    },
    {
      label: '导出宏文件',
      value: 'export',
      onClick: handleExportMacroFile,
    },
  ];
  return (
    <div className="macro-config">
      <div className="macro-item-left">
        <div className="macro-btn-group">
          <span>宏组</span>
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
          options={macroList}
          onChange={(e) => {
            handleSwitchCategory(e);
          }}
          defaultValue={currentCategory}
          size="small"
        />
        <div className="macro-btn-group">
          <span>宏名称</span>
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
          {!recording ? (
            <div
              className="macro-record-btn"
              onClick={() => {
                setRecording(true);
                setOpenRecords(true);
              }}
            >
              <HoverImage src={ic_play} hoverSrc={ic_play} alt="Logo" className="back-btn-icon" />
              开始录制
            </div>
          ) : (
            <div className="macro-record-btn" onClick={() => handleStopRecords()}>
              <HoverImage src={ic_stop} hoverSrc={ic_stop} alt="Logo" className="back-btn-icon" />
              停止录制
            </div>
          )}
          <HoverImage
            src={delete_macro_action_1}
            hoverSrc={delete_macro_action_2}
            alt="Logo"
            className="back-btn-icon"
          />
          {/* <HoverImage src={btn_up_1} hoverSrc={btn_up_2} alt="Logo" className="back-btn-icon" />
          <HoverImage src={btn_down_1} hoverSrc={btn_down_2} alt="Logo" className="back-btn-icon" /> */}
          <HoverImage
            src={ic_clear}
            hoverSrc={ic_clear}
            alt="Logo"
            className="back-btn-icon"
            onClick={() => handleClearRecords()}
          />
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
          <MacroActionList events={recordedActions} delayMode={delayMode} showDelay={false} />
        </ul>
      </div>
      <div className="macro-item-right">
        <div>录制延迟方式:</div>
        <ul className="macro-delay-mode">
          <li>
            <CustomRadio customSize="small" checked={delayMode === 'record'} onChange={() => setDelayMode('record')} />
            录制延迟
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
            ms默认
          </li>
          <li>
            <CustomRadio customSize="small" checked={delayMode === 'min'} onChange={() => setDelayMode('min')} />
            最小延迟
          </li>
        </ul>
        <div>按键</div>
        <div style={{ width: '95%' }}>
          <Dropdown borderColor="#ff7b00" options={Mouse.map((i) => i.Lang)} onChange={() => {}} size="small" />
        </div>
        <div> 延迟(ms) </div>
        <input
          type="text"
          style={{ width: '100%', backgroundColor: 'white', color: 'black', textAlign: 'center', border: '0px' }}
        />
        <div className="macro-action-btn" onClick={() => handleSave()}>
          保存
        </div>
        <div className="macro-action-btn" onClick={() => handleCancel()}>
          取消
        </div>
      </div>
    </div>
  );
};
export default MacroConfig;
