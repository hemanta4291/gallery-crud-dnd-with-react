// src/components/Gallery.js
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { products } from '../demo-data/products'

const Gallery = () => {
  const [productsImages, setProductsImages] = useState([...products]);

  const handleDragAndDrop = (results) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedImages = [...productsImages];

      const storeImagesIndex = source.index;
      const storeDestinatonIndex = destination.index;

      const [removedStoreImage] = reorderedImages.splice(storeImagesIndex, 1);
      reorderedImages.splice(storeDestinatonIndex, 0, removedStoreImage);

      return setProductsImages(reorderedImages);
    }
  }

  return (
    <div className='gallery-wrapper'>
      <div className='gallery-top'>
        <h1 className='gallery-title'>Gallery</h1>
      </div>
      <DragDropContext
        onDragEnd={handleDragAndDrop}
      >
        <Droppable droppableId='image-droppable-id' type='group' direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className='image-grid'>
              {
                productsImages?.map((item, index) => (
                  <Draggable draggableId={item.id} key={item.id} index={index}>
                    {(provided,snapshot) => (
                      <div 
                        className="image-grid-item" 
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        style={{
                          width: snapshot.isDragging ? '200px' : snapshot.draggingOver ? '100px' : 'auto'
                        
                        }}
                      >
                        <img src={item.src} alt={'image1'} />
                        {
                          // console.log(snapshot.isDragging)
                        provided.placeholder
                        }
                      </div>
                     
                    )}
                  </Draggable>

                ))
              }
            </div>
          
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Gallery;
