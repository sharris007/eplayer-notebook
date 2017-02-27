import Bookshelf from '../main';

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function init() {
  // Mock data for bookshelf component  
  const mockData = [{id: 1, author: 'Pete Hunt', image: 'http://content.stg-openclass.com/eps/pearson-reader/api/item/f8a98cb7-ffea-4d21-8b54-827981fd679e/1/file/DonatelleMH2-080315-MJ-CM/OPS/images/cover.jpg', title: 'Pyschology 101', description: 'Pysch description goes here'},
                    {id: 2, author: 'Dana Harvey', image: 'http://content.stg-openclass.com/eps/pearson-reader/api/item/74213210-a34d-11e5-8b87-219ee60c0efb/1/file/Blake3-082715-MJ-CM-CSS/OPS/images/cover.jpg', title: 'Structural Analysis', description: 'Structural Analysis description goes here'},
                    {id: 3, author: 'Trent Reznor', image: 'http://content.stg-openclass.com/eps/pearson-reader/api/item/651da29d-c41d-415e-b8a4-3eafed0057db/1/file/LutgensAtm13-071415-MJ-DW/OPS/images/cover.jpg', title: 'English 101', description: 'English description goes here'},
                    {id: 4, author: 'Julianne Moore', image: 'https://content.stg-openclass.com/eps/pearson-reader/api/item/8f3e17f9-bebe-463c-a55d-87b2c976c65d/1/file/WhitingLM1-062716-so/OPS/images/cover.jpg', title: 'Economics', description: 'Economics description goes here'},
                    {id: 5, author: 'Brandy Chastain', image: 'http://content.stg-openclass.com/eps/pearson-reader/api/item/9557d0fc-0c6e-47be-96a0-71b9208a70eb/1/file/Belk5wPhys-080615-MJ-CM/OPS/images/cover.jpg', title: 'Human Anatomy', description: 'Human Anatomy description goes here'},
                    {id: 6, author: 'Ian McKellan', image: 'http://content.stg-openclass.com/eps/pearson-reader/api/item/c6453c40-ecda-11e5-9136-03b2eeb2556b/1/file/glossary-sample_standard/OPS/images/cover.jpg', title: 'Nursing Conepts', description: 'Nursing Concepts description goes here'},
                    {id: 7, author: 'Brittany Dorfman', image: 'http://content.stg-openclass.com/eps/pearson-reader/api/item/32e75b80-bf9a-11e5-929d-db71ada04282/1/file/9780134063737_et2_dcusb_l1/OPS/images/cover.jpg', title: 'Music Theory', description: 'Music Theory description goes here'}, 
                    {id: 8, author: 'No Name', image: '', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultrices augue, a interdum diam. Sed dignissim augue sit amet tempor tincidunt.', description: 'Lorem Ipsum description goes here'}];
                        
  const locale = getParameterByName('locale');
  
  // Create new instance of bookshelf component
  new Bookshelf({
    elementId: 'bookshelf-demo',    
    locale: locale,
    books: mockData
  });  
}

window.onload = init;
