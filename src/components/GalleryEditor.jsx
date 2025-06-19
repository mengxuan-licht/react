import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function GalleryEditor({ images, setImages, onUpload, fadeOut, onClose }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    if (result.destination.droppableId === 'trash') {
      const newImages = [...images];
      newImages.splice(result.source.index, 1);
      setImages(newImages);
      return;
    }

    const reordered = Array.from(images);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setImages(reordered);
  };

  return (
    <div className={`gallery-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="gallery-editor">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2>拖曳排序畫廊圖片</h2>
        <input type="file" accept="image/*" onChange={onUpload} />

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="gallery" direction="horizontal">
            {(provided) => (
              <div
                className="editor-grid"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {images.map((src, index) => (
                  <Draggable key={src} draggableId={src} index={index}>
                    {(provided) => (
                      <div
                        className="draggable-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <img src={src} alt={`作品 ${index + 1}`} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="trash">
            {(provided, snapshot) => (
              <div
                className={`trash-zone ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                🗑 拖曳到此刪除圖片
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
