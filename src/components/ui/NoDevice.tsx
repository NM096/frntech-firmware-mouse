import noDevice from '@/assets/no_device.png';
const NoDevice = () => {
  return (
    <div className="no-device-container">
      <p className="no-device-text">
        Please connect your <span className="highlight">FRNTECH</span> device!
      </p>
      <img src={noDevice} className="no-device-img" alt="" />
    </div>
  );
};

export default NoDevice;
