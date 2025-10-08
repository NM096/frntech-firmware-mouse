import { useState } from 'react';
import { getKeyName, getMouseName } from '@/hooks/useMacroRecorder';
const useActionMacroFile = () => {
  const [recordList, setRecordList] = useState<any[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number | null>(null);

  // 获取一个 block（Action + Delay）
  const getMoveBlock = (list: any[], idx: number) => {
    if (idx < 0 || idx >= list.length) return { block: [], start: -1 };

    // 如果点中 Delay，则回到前面的 Action
    const start = list[idx].type === 'Delay' ? idx - 1 : idx;

    if (start >= 0 && start + 1 < list.length && list[start + 1].type === 'Delay') {
      return { block: [list[start], list[start + 1]], start };
    }

    // 没有 Delay 就只返回 Action
    return { block: [list[start]], start };
  };

  // 上移
  const moveUpStep = () => {
    console.log('moveUpStep called, currentStepIdx:', currentStepIdx);
    if (currentStepIdx === null || currentStepIdx <= 0) return;

    setRecordList((prev) => {
      const newList = [...prev];
      const { block, start } = getMoveBlock(newList, currentStepIdx);
      if (!block.length || start <= 0) return newList;

      // 找到前一个 block 的开始位置
      const prevBlock = getMoveBlock(newList, start - 2);
      const insertPos = prevBlock.start;

      newList.splice(start, block.length);
      newList.splice(insertPos, 0, ...block);
      return newList;
    });

    setCurrentStepIdx((idx) => (idx !== null ? Math.max(idx - 2, 0) : idx));
  };

  const moveDownStep = () => {
    console.log('moveUpStep called, currentStepIdx:', currentStepIdx);

    if (currentStepIdx === null) return;
    setRecordList((prev) => {
      const newList = [...prev];
      const { block, start } = getMoveBlock(newList, currentStepIdx);
      if (!block.length) return newList;

      const nextBlock = getMoveBlock(newList, start + block.length);
      if (nextBlock.start === -1) return newList;

      const insertPos = nextBlock.start + nextBlock.block.length;

      newList.splice(start, block.length); // 删除当前 block
      newList.splice(insertPos, 0, ...block); // 插到下一个 block 后面
      return newList;
    });

    setCurrentStepIdx((idx) => (idx !== null ? idx + 2 : idx));
  };

  // 删除
  const deleteStep = () => {
    if (currentStepIdx === null) return;

    setRecordList((prev) => {
      const newList = [...prev];
      const { block, start } = getMoveBlock(newList, currentStepIdx);
      if (!block.length) return newList;

      newList.splice(start, block.length);
      return newList;
    });

    setCurrentStepIdx(null); // 删除后不选中
  };

  // 选中
  const selectStep = (index: number) => {
    if (index < 0 || index >= recordList.length) return;
    setCurrentStepIdx(index);
  };
  const updateStepDelay = (delay: number) => {
    if (currentStepIdx === null) return;
    setRecordList((prev) => {
      const newList = [...prev];
      newList[currentStepIdx + 1] = { ...newList[currentStepIdx + 1], code: String(delay), name: String(delay) };
      return newList;
    });
  };
  const updateStepKeyboard = (event: KeyboardEvent) => {
    if (currentStepIdx === null) return;
    setRecordList((prev) => {
      const newList = [...prev];
      if (event.key === 'Unidentified') return newList;
      const name = getKeyName(event);
      if (!name) return newList;
      newList[currentStepIdx] = { ...newList[currentStepIdx], name: name, code: event.code };
      return newList;
    });
  };
  const updateStepMouse = (mouseKey: string) => {
    if (currentStepIdx === null) return;
    setRecordList((prev) => {
      const newList = [...prev];
      newList[currentStepIdx] = { ...newList[currentStepIdx], name: mouseKey };
      return newList;
    });
  };
  return {
    recordList,
    currentStepIdx,
    setRecordList,
    setCurrentStepIdx,
    moveUpStep,
    moveDownStep,
    deleteStep,
    selectStep,
    updateStepDelay,
    updateStepKeyboard,
    updateStepMouse,
  };
};

export default useActionMacroFile;
