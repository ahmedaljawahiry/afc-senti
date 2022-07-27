import { useState } from "react";

const MAX_SIZE = 10;

export default function useBucket() {
  const [bucket, setBuckets] = useState<Array<number>>(Array(MAX_SIZE).fill(0));

  function addToBucket(no: number) {
    const _number = Math.abs(no);
    if (_number <= 1) {
      const index = Math.floor(_number * 10);

      setBuckets((old) => {
        const _new = [...old];
        _new[index]++;
        return _new;
      });
    }
  }

  return {
    bucket,
    addToBucket,
    reset: () => setBuckets(Array(MAX_SIZE).fill(0)),
  };
}
