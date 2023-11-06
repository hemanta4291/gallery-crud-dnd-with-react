// src/components/Gallery.js
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { products } from '../demo-data/products'
import { Icons } from './Icons';

const Gallery = () => {
  const [productsImages, setProductsImages] = useState([...products]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [fileInput, setFileInput] = useState(null);



  const sortByIsFeatuedFirstIndex = () => {
    const featuredProducts = productsImages.filter(product => product.isFeatured);
    const nonFeaturedProducts = productsImages.filter(product => !product.isFeatured);

    const combinedProducts = [...featuredProducts, ...nonFeaturedProducts];
    setProductsImages(combinedProducts)
  }

  useEffect(() => {
    sortByIsFeatuedFirstIndex()

  }, [])


// handle drag and drop 
  const handleDragAndDrop = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedImages = [...productsImages];

      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      const [draggedItem] = reorderedImages.splice(sourceIndex, 1);
      const [destinationItem] = reorderedImages.splice(destinationIndex, 1);

      if (sourceIndex === 0 || destinationIndex === 0) {
        draggedItem.isFeatured = !draggedItem.isFeatured;
        destinationItem.isFeatured = !destinationItem.isFeatured;
      }
      reorderedImages.splice(destinationIndex, 0, draggedItem);
      reorderedImages.splice(sourceIndex, 0, destinationItem);

      setProductsImages(reorderedImages);
    }
  };







  // selected
  const toggleSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((item) => item !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // delete handle
  const handleDeleteSelected = () => {
    setProductsImages(productsImages.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

// add or upload handle
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newImages = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        src: URL.createObjectURL(file),
        isFeatured: false,
      }));

      setProductsImages([...productsImages, ...newImages]);
      setFileInput(null);
    }
  };

  return (
    <div className='gallery-wrapper'>
      <div className='gallery-top'>
        <h1 className='gallery-title'>
          {selectedItems.length === 0
            ? 'Gallery'
            : (
              <>
                <input
                  type='checkbox'
                  checked={true}
                  style={{ width: '24px', height: '24px',marginRight:'16px' }}
                />
                {selectedItems.length} file{selectedItems.length > 1 ? 's' : ''} selected
              </>
            )}
        </h1>
        {
          selectedItems.length > 0 &&
          <button onClick={handleDeleteSelected} className='images-delete-btn'>
            {
              selectedItems.length === 1 ? 'Delete file' : 'Delete files'
            }
          </button>
        }
      </div>

        {
          productsImages.length === 0 ?
          <div className='no-data-found'>
            <h1>No Data Found !</h1>
          </div>

        :
        <DragDropContext
          onDragEnd={handleDragAndDrop}
        >

          <div className='image-grid'>
            {
              productsImages?.map((item, index) => (
                <Droppable droppableId={`image-droppable-${item.id}`} type='group' direction="vertical" >
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className={`image-grid-item ${index === 0 ? 'featured' : ''} ${selectedItems.includes(item.id) ? 'selected' : ''}`}>
                      <Draggable draggableId={item.id} key={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div className={`${snapshot.isDragging ? 'is-dragging' : ''}`}

                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}



                          >
                            <div className='image-overlay'>
                              <img src={item.src} alt={'image1'} />
                            </div>

                            {

                              provided.placeholder
                            }

                            <label className={`image-checkbox`}>
                              <input
                                type='checkbox'
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleSelect(item.id)}
                              />
                            </label>
                          </div>
                        )}
                      </Draggable>
                    </div>
                  )}
                </Droppable>
              ))
            }
            <div className="image-upload">
              <input
                multiple
                type="file"
                accept="image/*"
                ref={(input) => setFileInput(input)}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button onClick={() => fileInput && fileInput.click()}>
                <div className='image-upload-icon'>
                  {Icons.uploadIcon}
                </div>
                Add Image
              </button>
            </div>
          </div>
        </DragDropContext>
    
      }
    </div>
  );
};

export default Gallery;
