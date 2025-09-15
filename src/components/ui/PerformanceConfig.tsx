import CustomRadio from '../common/CustomRadio';
import HoverImage from '../common/HoverImage';
import Slider2 from '../common/Slider2';
import { Switch } from '../common/Switch';
import ic_window from '@/assets/windows_1.png';
import ic_window2 from '@/assets/windows_2.png';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import { useState } from 'react';
import { useModal } from '@/components/common/ModalContext';
import { setReportRate } from '@/utils/driver';
import type { AdvanceSetting } from '@/types/device-data';
import { setAdvanceSetting as sendAdvanceSetting } from '@/utils/driver';
import { cloneDeep } from 'lodash';
const PerformanceConfig = () => {
  const { openConfigLoading, close } = useModal();
  const { currentDevice, path, mode, setCurrentDevice } = useBaseInfoStore();

  const [advanceSetting, setAdvanceSetting] = useState<AdvanceSetting | undefined>(currentDevice?.Info.AdvanceSetting);
  const [usbReport, setUsbReport] = useState(currentDevice?.Info.USBReports?.[0] || 0);
  //
  const handleChangeUsbReport = (index: number) => {
    setUsbReport(index);
    const _loadingId = openConfigLoading({ proccess: 0 });
    const newUsbReport = currentDevice?.Info.USBReports || [0, 0, 0, 0];
    newUsbReport[mode] = index;
    setReportRate(
      path,
      {
        USBReports: newUsbReport,
        WLReports: currentDevice?.Info.WLReports || [0, 0, 0, 0],
      },
      (payload) => {
        if (payload) {
          setCurrentDevice({
            ...currentDevice,
            ...{ Info: { ...currentDevice?.Info, ...{ USBReports: newUsbReport } } },
          } as any);
        }
        close(_loadingId);
      }
    );
  };
  const handleChangeltitude = (name: string, value: number | boolean) => {
    const _loadingId = openConfigLoading({ proccess: 0 });
    const newAdvanceSetting = cloneDeep({ ...advanceSetting, [name]: value });
    setAdvanceSetting(newAdvanceSetting);
    sendAdvanceSetting(path, newAdvanceSetting, (payload) => {
      if (payload) {
        setCurrentDevice({
          ...currentDevice,
          ...{ Info: { ...currentDevice?.Info, ...{ AdvanceSetting: newAdvanceSetting } } },
        } as any);
      }
      close(_loadingId);
    });
  };
  const sleepTime = ['10', '30', '60', '120', '180', '300', '600'];
  const deepSleepTime = ['5', '10', '15', '20', '30', '60'];
  const silentAltitudes = ['1 MM', '2 MM', '3 MM', '4 MM'];
  const rateList = ['125Hz', '250Hz', '500Hz', '1000Hz'];
  return (
    <div className="performance-config">
      <div className="performance-section">
        <div className="performance-item">
          <div className="performance-item-title">回报率设置</div>
          <div className="performance-item-description">有线和无线模式时鼠标轮询速率(蓝牙状态下设置无效)</div>
          <div className="performance-radio-group">
            {rateList.map((rate, index) => (
              <div className="performance-radio-item" key={index}>
                <CustomRadio checked={usbReport === index} onChange={() => handleChangeUsbReport(index)} />
                {rate}
              </div>
            ))}
          </div>
        </div>
        <div className="performance-item">
          <div className="performance-item-title">体眠时间设置(单位:秒)</div>
          <div className="performance-item-description">鼠标静止大于设置时间后进入休眠状态</div>
          <Slider2
            min={0}
            max={sleepTime.length - 1}
            data={sleepTime}
            step={1}
            initialValue={advanceSetting?.WLPrimarySleep}
            onChange={(value) => handleChangeltitude('WLPrimarySleep', value)}
          />
        </div>
        <div className="performance-item">
          <div className="performance-item-title">睡眠时间设置(单位:分钟)</div>
          <div className="performance-item-description">鼠标停止后大于设置时间进入睡眠状态</div>
          <Slider2
            min={0}
            max={deepSleepTime.length - 1}
            data={deepSleepTime}
            step={1}
            initialValue={advanceSetting?.WLDeepSleep}
            onChange={(value) => handleChangeltitude('WLDeepSleep', value)}
          />
        </div>
        <div className="performance-item">
          <div className="performance-item-title">按键响应时间(单位:毫秒)</div>
          <div className="performance-item-description">按键响应时间</div>
          <Slider2 min={0} max={10} step={1} initialValue={5} data={[]} />
        </div>
      </div>
      <div className="performance-section">
        <div className="performance-item">
          <div className="performance-item-title">波纹控制</div>
          <div className="performance-item-description">
            开启波纹控制之后鼠标会在高速情况下进行算法修正消除波浪形的抖动
            <Switch
              checked={advanceSetting?.MoveWakeUp}
              onChange={() => handleChangeltitude('MoveWakeUp', !advanceSetting?.MoveWakeUp)}
            />
          </div>
        </div>
        <div className="performance-item">
          <div className="performance-item-title">直线修正</div>
          <div className="performance-item-description">
            开启直线修正之后鼠标更容易画出直线
            <Switch
              checked={advanceSetting?.RippleControl}
              onChange={() => handleChangeltitude('RippleControl', !advanceSetting?.RippleControl)}
            />
          </div>
        </div>
        <div className="performance-item">
          <div className="performance-item-title">移动同步</div>
          <div className="performance-item-description">
            开启移动同步之后鼠标的离散率会被算法修
            <Switch
              checked={advanceSetting?.UltraLowDelay}
              onChange={() => handleChangeltitude('UltraLowDelay', !advanceSetting?.UltraLowDelay)}
            />
          </div>
        </div>
        <div className="performance-item">
          <div className="performance-item-title">鼠标抬起高度</div>
          <div className="performance-item-description">鼠标抬起高度</div>
          <div className="performance-radio-group">
            {silentAltitudes.map((i, idx) => {
              return (
                <div className="performance-radio-item" key={i}>
                  <CustomRadio
                    checked={idx == advanceSetting?.SilentAltitude}
                    onChange={() => handleChangeltitude('SilentAltitude', idx)}
                  />
                  {i}
                </div>
              );
            })}
          </div>
        </div>
        <div className="performance-item">
          <div className="performance-item-title">鼠标属性</div>
          <div className="performance-item-description">Windows系统鼠标属性设置 </div>
          <div className="performance-item-open">
            <HoverImage src={ic_window} hoverSrc={ic_window2} alt="Reset" className="icon-7" />
            打开鼠标属性
          </div>
        </div>
      </div>
    </div>
  );
};
export default PerformanceConfig;
