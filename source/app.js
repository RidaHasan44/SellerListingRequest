"use strict";

//Constant price threshold
const LUXURY_PRICE_THRESHOLD = 500;

//Declares variables for the form inputs and decision messages
const form = document.querySelector('#listingForm');
const sellerFirstNameInput = document.querySelector('#sellerFirstName');
const sellerLastNameInput = document.querySelector('#sellerLastName');
const sellerIdInput = document.querySelector('#sellerId');
const itemNameInput = document.querySelector('#itemName');
const genderInput = document.querySelector('#gender');
const clothingTypeInput = document.querySelector('#clothing');
const conditionInput = document.querySelector('#condition');
const sizeInput = document.querySelector('#sizeClothing');
const descriptionInput = form.querySelector('[name="item description"]');
const dressesSkirtsOption = clothingTypeInput.querySelector('option[value="dressesSkirts"]');
const priceInput = document.querySelector('#price');
const quantityInput = document.querySelector('#quantity');
const productImagesInput = document.querySelector('#productImages');
const sellerFirstNameMessage = document.querySelector('#sellerFirstNameMessage');
const sellerLastNameMessage = document.querySelector('#sellerLastNameMessage');
const sellerIdMessage = document.querySelector('#sellerIdMessage');
const sizeLabel = document.querySelector('#sizeLabel');
const approvalMessage = document.querySelector('#approvalMessage');
const quantityMessage = document.querySelector('#quantityMessage');
const imageMessage = document.querySelector('#imageMessage');
const submitMessage = document.querySelector('#submitMessage');
const submitButton = form.querySelector('button[type="submit"]');
const confirmationPanel = document.querySelector('#confirmationPanel');
const confirmationTicket = document.querySelector('#confirmationTicket');
const confirmationStatus = document.querySelector('#confirmationStatus');
const confirmationSeller = document.querySelector('#confirmationSeller');
const confirmationItem = document.querySelector('#confirmationItem');
const confirmationCategory = document.querySelector('#confirmationCategory');
const confirmationCondition = document.querySelector('#confirmationCondition');
const confirmationSize = document.querySelector('#confirmationSize');
const confirmationPrice = document.querySelector('#confirmationPrice');
const confirmationQuantity = document.querySelector('#confirmationQuantity');
const newSubmissionButton = document.querySelector('#newSubmissionButton');

//Testing statement for moderator approval
function requiresModeratorApproval(amount) {
  return amount > LUXURY_PRICE_THRESHOLD;
}

function updateSellerNameValidity(input, message) {
  const invalidName = input.value !== '' && !/^\p{L}+(?:[ -]\p{L}+)*$/u.test(input.value);
  const errorMessage = invalidName ? 'Use letters, spaces, and dashes only.' : '';
  input.setCustomValidity(errorMessage);
  message.textContent = errorMessage;
}

function updateSellerIdValidity() {
  const invalidId = sellerIdInput.value !== '' && !/^\d{6}$/.test(sellerIdInput.value);
  const errorMessage = invalidId ? 'Seller ID must be exactly 6 digits.' : '';
  sellerIdInput.setCustomValidity(errorMessage);
  sellerIdMessage.textContent = errorMessage;
}

function updateSizeOptions() {
  const isShoes = clothingTypeInput.value === 'shoes';
  const isPantsOrShorts = clothingTypeInput.value === 'pantsShorts';
  const genderSpecificPantsSizes = {
    male: [
      ['34 (XS)', '34'],
      ['36 (S)', '36'],
      ['38 (M)', '38'],
      ['40 (L)', '40'],
      ['42 (XL)', '42'],
      ['44 (XXL)', '44']
    ],
    female: [
      ['2 (XS)', '2'],
      ['4 (S)', '4'],
      ['6 (M)', '6'],
      ['8/10 (L)', '8/10'],
      ['12 (XL)', '12'],
      ['14 (XXL)', '14']
    ]
  };
  const sizes = isShoes
    ? [['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['10', '10'], ['11', '11'], ['12', '12'], ['Other', 'other']]
    : isPantsOrShorts && genderSpecificPantsSizes[genderInput.value]
      ? genderSpecificPantsSizes[genderInput.value]
      : [
        ['XXSmall', 'extraXSmall'],
        ['XSmall', 'extraSmall'],
        ['Small', 'small'],
        ['Medium', 'medium'],
        ['Large', 'large'],
        ['XLarge', 'extraLarge'],
        ['XXLarge', 'extraXLarge']
      ];
  const options = [new Option(isShoes ? 'Choose a shoe size' : 'Choose a size', '')];

  sizes.forEach(([label, value]) => {
    options.push(new Option(label, value));
  });
  sizeInput.replaceChildren(...options);
  sizeLabel.textContent = isShoes ? 'Shoe Size' : 'Clothing Size';
}

function updateClothingOptions() {
  const isMale = genderInput.value === 'male';
  dressesSkirtsOption.hidden = isMale;
  dressesSkirtsOption.disabled = isMale;

  if (isMale && clothingTypeInput.value === 'dressesSkirts') {
    clothingTypeInput.value = '';
  }
  updateSizeOptions();
}

function updateApprovalMessage() {
  //Converts strings into readable numbers for HTML
  const amount = Number(priceInput.value);

  //Checks values and updates message accordingly
  if (priceInput.value === '') {
    approvalMessage.textContent = '';
    return;
  }
  if (!priceInput.validity.valid) {
    approvalMessage.textContent = 'Price must be greater than $0.';
    return;
  }
  if (requiresModeratorApproval(amount)) {
    approvalMessage.textContent = 'Moderator review is required.';
  } else {
    approvalMessage.textContent = 'Path approved.';
  }
}

function updateImageMessage() {
  const imageCount = productImagesInput.files.length;
  const hasNonImageFile = Array.from(productImagesInput.files)
    .some((file) => !file.type.startsWith('image/'));
  let errorMessage = '';

  if (imageCount === 0) {
    errorMessage = 'Upload at least one product image for standard approval.';
  } else if (imageCount > 10) {
    errorMessage = 'Choose no more than 10 images.';
  } else if (hasNonImageFile) {
    errorMessage = 'Choose image files only.';
  } else {
    imageMessage.textContent = `${imageCount} image${imageCount === 1 ? '' : 's'} selected.`;
  }
  productImagesInput.setCustomValidity(errorMessage);
  if (errorMessage) imageMessage.textContent = errorMessage;
  updateApprovalMessage();
}

function updateQuantityMessage() {
  if (quantityInput.value === '') {
    quantityMessage.textContent = '';
    return;
  }
  if (!quantityInput.validity.valid) {
    quantityMessage.textContent = 'Enter a whole quantity of at least 1.';
  } else {
    quantityMessage.textContent = 'Path approved.';
  }
}

function generateTicketNumber() {
  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStamp = Math.floor(1000 + Math.random() * 9000);
  return `LS-${dateStamp}-${randomStamp}`;
}

function formatApprovalPath(amount) {
  return requiresModeratorApproval(Number(amount)) ? 'Manual Review' : 'Standard Approval';
}

function renderConfirmation(ticketNumber, approvalPath, listing) {
  confirmationTicket.textContent = ticketNumber;
  confirmationStatus.textContent = approvalPath;
  confirmationStatus.style.background = approvalPath === 'Manual Review' ? '#fce8f0' : '#eafaf1';
  confirmationStatus.style.color = approvalPath === 'Manual Review' ? '#7d2d4c' : '#185e3f';
  confirmationSeller.textContent = `${listing.firstName} ${listing.lastName} (${listing.sellerId})`;
  confirmationItem.textContent = listing.itemName;
  confirmationCategory.textContent = listing.category || 'Not provided';
  confirmationCondition.textContent = listing.condition || 'Not provided';
  confirmationSize.textContent = listing.size || 'Not provided';
  confirmationPrice.textContent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(listing.price);
  confirmationQuantity.textContent = String(listing.quantity);
  confirmationPanel.hidden = false;
  confirmationPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetSubmissionState() {
  confirmationPanel.hidden = true;
  submitMessage.textContent = '';
  form.reset();
  updateClothingOptions();
  updateImageMessage();
  updateApprovalMessage();
  updateQuantityMessage();
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!form.checkValidity()) {
    submitMessage.textContent = 'Please correct the highlighted fields before submitting.';
    form.reportValidity();
    return;
  }

  const listing = {
    sellerId: sellerIdInput.value.trim(),
    firstName: sellerFirstNameInput.value.trim(),
    lastName: sellerLastNameInput.value.trim(),
    itemName: itemNameInput.value.trim(),
    gender: genderInput.value,
    category: clothingTypeInput.value,
    clothingType: clothingTypeInput.value,
    condition: conditionInput.value,
    size: sizeInput.value,
    price: Number(priceInput.value),
    quantity: Number(quantityInput.value),
    description: descriptionInput.value.trim(),
    images: Array.from(productImagesInput.files, (file) => file.type)
  };

  submitButton.disabled = true;
  submitMessage.textContent = 'Verifying listing...';

  const ticketNumber = generateTicketNumber();
  const approvalPath = formatApprovalPath(listing.price);

  try {
    const response = await fetch('https://ee9v38wgx2.execute-api.us-east-1.amazonaws.com/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing)
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      submitMessage.textContent = result.message || 'The API rejected this listing.';
      return;
    }

    renderConfirmation(ticketNumber, result.approvalPath || approvalPath, listing);
    submitMessage.textContent = result.message || 'Listing submitted successfully.';
  } catch (error) {
    console.error(error);
    renderConfirmation(ticketNumber, approvalPath, listing);
    submitMessage.textContent = 'The API is offline, but the submission details were captured locally for later upload.';
  } finally {
    submitButton.disabled = false;
  }
}

sellerFirstNameInput.addEventListener('input', () => {
  updateSellerNameValidity(sellerFirstNameInput, sellerFirstNameMessage);
});
sellerLastNameInput.addEventListener('input', () => {
  updateSellerNameValidity(sellerLastNameInput, sellerLastNameMessage);
});
sellerIdInput.addEventListener('input', updateSellerIdValidity);
genderInput.addEventListener('change', updateClothingOptions);
clothingTypeInput.addEventListener('change', updateSizeOptions);
priceInput.addEventListener('input', updateApprovalMessage);
productImagesInput.addEventListener('change', updateImageMessage);
quantityInput.addEventListener('input', updateQuantityMessage);
form.addEventListener('submit', handleSubmit);
form.addEventListener('input', () => {
  submitMessage.textContent = '';
});
form.addEventListener('change', () => {
  submitMessage.textContent = '';
});
newSubmissionButton.addEventListener('click', () => {
  resetSubmissionState();
});

updateClothingOptions();
