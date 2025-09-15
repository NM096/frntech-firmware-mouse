import noDevice from '@/assets/no_device.png';
const NoDevice = () => {
  return (
    <div className="no-device-container">
      <p className="no-device-text">
        请连接您的 <span className="highlight">inphic</span> 设备！
      </p>
      <img src={noDevice} className="no-device-img" alt="" />
    </div>
  );
};

export default NoDevice;
