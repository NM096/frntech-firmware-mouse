import { onDriverMessage } from '@/utils/driver';
import { useBaseInfoStore } from '@/store/useBaseInfoStore';
import useProfileAction from '@/hooks/useProfileAction';

export const useListenMouse = () => {
  const { setHistoryConfigFileName } = useBaseInfoStore();
  const { handleSelectProfile } = useProfileAction();

  const listenChangeProfileAppActive = () => {
    onDriverMessage('ProfileAppActive', (payload) => {
      console.log(localStorage.getItem('base-info-store'));
      const { currentModelID, currentConfigFileName } = useBaseInfoStore.getState();
      console.log('ProfileAppActive', currentConfigFileName, payload.Name);
      if (payload.Model === currentModelID && currentConfigFileName !== payload.Name) {
        console.log('---------SwitchFileName-----------', payload.Name);
        console.log('---------HistoryConfigFileName-----------', currentConfigFileName);
        setHistoryConfigFileName(currentConfigFileName);
        handleSelectProfile(payload.Name);
      }
    });
  };
  const listenChangeProfileAppInactive = () => {
    onDriverMessage('ProfileAppInactive', (payload) => {
      const { currentModelID, historyConfigFileName } = useBaseInfoStore.getState();
      if (payload.Model === currentModelID && historyConfigFileName !== '') {
        console.log('---------SwitchFileName-----------', historyConfigFileName);
        handleSelectProfile(historyConfigFileName);
        setHistoryConfigFileName('');
      }
    });
  };
  return {
    listenChangeProfileAppActive,
    listenChangeProfileAppInactive,
  };
};

export default useListenMouse;
