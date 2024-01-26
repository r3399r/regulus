import { useEffect, useState } from 'react';
import fieldEndpoint from 'src/api/fieldEndpoint';
import Checkbox from 'src/component/Checkbox';
import Modal from 'src/component/Modal';
import { Tag } from 'src/model/backend/entity/TagEntity';

type Props = {
  open: boolean;
  handleClose: () => void;
  onSubmit: (v: string) => void;
  query?: string;
};

const ModalTag = ({ open, handleClose, onSubmit, query }: Props) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [input, setInput] = useState<string>();
  const [tag, setTag] = useState<Tag[]>();

  useEffect(() => {
    if (!input) {
      setTag(undefined);

      return;
    }
    const timer = setTimeout(() => {
      fieldEndpoint.getFieldTag({ query: input }).then((res) => {
        setTag(res.data);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

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
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-md border border-grey-300 p-2"
          placeholder="輸入文字"
        />
        <div className="flex flex-wrap py-4">
          {tag?.map((v) => (
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
