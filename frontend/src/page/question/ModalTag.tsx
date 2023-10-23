import { useEffect, useState } from 'react';
import Checkbox from 'src/component/Checkbox';
import Modal from 'src/component/Modal';
import { Chapter } from 'src/model/backend/entity/ChapterEntity';

type Props = {
  open: boolean;
  handleClose: () => void;
  chapter: Chapter[];
  onSubmit: (v: string) => void;
  query?: string;
};

const ModalTag = ({ open, handleClose, chapter, onSubmit, query }: Props) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (query) setSelected(new Set(query.split(',')));
    else setSelected(new Set());
  }, [query]);

  const onClose = () => {
    handleClose();
    if (query) setSelected(new Set(query.split(',')));
    else setSelected(new Set());
  };

  return (
    <Modal open={open} handleClose={onClose}>
      <>
        <div className="flex flex-wrap py-4">
          {chapter.map((v) => (
            <div key={v.id} className="w-full p-2 sm:w-1/3">
              <Checkbox
                label={v.name}
                checked={selected.has(v.name)}
                onChange={(e) => {
                  const temp = new Set(selected);
                  if (e.target.checked) temp.add(v.name);
                  else temp.delete(v.name);
                  setSelected(temp);
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <button className="rounded-md bg-grey-200 px-6 py-2 text-sm" onClick={onClose}>
            取消
          </button>
          <button
            className="rounded-md bg-indigo-500 px-6 py-2 text-sm text-white"
            onClick={() => onSubmit([...selected].join())}
          >
            確認
          </button>
        </div>
      </>
    </Modal>
  );
};

export default ModalTag;
