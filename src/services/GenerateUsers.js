import axios from 'axios';


import {faker }  from "@faker-js/faker";
import { createModerator } from './user';

const ABOUT_OPTIONS = [
  'loves to read',
  'enjoys hiking and camping',
  'is a great cook',
  'has traveled to over 10 countries',
  'plays the guitar in a band',
  'is fluent in Spanish',
  'has a pet cat named Fluffy',
  'likes to paint in their free time',
  'is a huge fan of Star Wars',
  'is training for a marathon',
  'is a talented photographer',
  'volunteers at a local animal shelter',
  'is an avid scuba diver',
  'is a history buff',
  'is a math whiz',
  'is a skilled woodworker',
  'is a passionate environmentalist',
  'has a black belt in karate',
  'has a degree in psychology',
  'is a wine connoisseur',
  'loves to dance',
  'is a competitive chess player',
  'is a dedicated yogi',
  'is a master of origami',
  'enjoys stargazing on clear nights',
  'is an amateur astronomer',
  'is a fashionista',
  'is a gifted storyteller',
  'is an aspiring author',
];

const getRandomAboutSentence = (name) => {
  const randomIndex = Math.floor(Math.random() * ABOUT_OPTIONS.length);
  const aboutSentence = ABOUT_OPTIONS[randomIndex];
  return `${name} ${aboutSentence}.`;
}

const REGION_OPTIONS = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachussetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennslyvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virgina',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

const getRandomRegion = () => {
  const randomIndex = Math.floor(Math.random() * REGION_OPTIONS.length);
  return REGION_OPTIONS[randomIndex];
}

const APPEARANCE_OPTIONS = [
  'Caucasian',
  'African American',
  'Hispanic',
  'Asian',
  'South Asian',
  'Middle Eastern',
  'Native American',
  'Pacific Islander',
  'Ebony',
  'Arabic',
  'White',
  'Latin',
  'Indian',
  'Mixed',
];

const getRandomAppearance = () => {

  const randomIndex = Math.floor(Math.random() * APPEARANCE_OPTIONS.length);

  return APPEARANCE_OPTIONS[randomIndex];
}

const RELATIONSHIP_STATUS_OPTIONS = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'In a relationship',
  'It\'s complicated',
];

const getRandomRelationshipStatus = () => {
  const randomIndex = Math.floor(Math.random() * RELATIONSHIP_STATUS_OPTIONS.length);

  return RELATIONSHIP_STATUS_OPTIONS[randomIndex];
}


function generateUsername() {
    const adjectives = ['happy', 'sad', 'silly', 'clever', 'brave', 'funny', 'caring', 'kind', 'smart', 'cool'];
    const nouns = ['panda', 'owl', 'elephant', 'tiger', 'giraffe', 'koala', 'lion', 'monkey', 'bear', 'fox'];
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    
    return `${adjective}_${noun}_${randomNumber}`;
  }

  function generateRandomEmail() {
    const providers = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    const domains = ['com', 'org', 'net', 'info', 'io'];
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    
    const usernameLength = Math.floor(Math.random() * 10) + 5; // 5-14 characters
    let username = '';
    for (let i = 0; i < usernameLength; i++) {
      if (Math.random() < 0.5) {
        username += letters[Math.floor(Math.random() * letters.length)];
      } else {
        username += numbers[Math.floor(Math.random() * numbers.length)];
      }
    }
    
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    return `${username}@${provider}.${domain}`;
  }
  

async function generateRandomFemaleProfile() {
  // Generate a random name
  const name = faker.name.findName(undefined, undefined, 0, 'female');

  // Generate a random age
  const age = faker.datatype.number({min: 18, max: 50});

  // Generate a random height in centimeters
  const height = faker.datatype.number({min: 150, max: 170});

  // Generate a random "about" description
  const about = getRandomAboutSentence(name);

  const username = generateUsername();

  const email = generateRandomEmail();

  const password = "Psssword";

  const region = getRandomRegion();

  const appearance = getRandomAppearance();

  const gender = 'Female';

  const relationship = getRandomRelationshipStatus();

  const image = await axios.get('https://api.unsplash.com/photos/random/?query=female&orientation=portrait&client_id=wgGhhm_ZZbGKSe8-JrfuXXEhMsRXk6lykIOwLMUE13M');

  const profilePictureUrl = image.data.urls.small;


  // Return an object containing the profile information
  return { name, age, gender, relationship, height, password, about, avatarImage:profilePictureUrl, username, email, region, appearance };
}

// generate male profile
async function generateRandomMaleProfile() {
  // Generate a random name
  const name = faker.name.findName(undefined, undefined, 0, 'male');

  // Generate a random age
  const age = faker.datatype.number({min: 18, max: 50});

  // Generate a random height in centimeters
  const height = faker.datatype.number({min: 150, max: 170});

  const about = getRandomAboutSentence(name);

  const username = generateUsername();

  const email = generateRandomEmail();

  const password = "Psssword";

  const gender = 'Male';

  const region = getRandomRegion();

  const appearance = getRandomAppearance();

  const relationship = getRandomRelationshipStatus();

  const image = await axios.get('https://api.unsplash.com/photos/random/?query=male&orientation=portrait&client_id=wgGhhm_ZZbGKSe8-JrfuXXEhMsRXk6lykIOwLMUE13M');

  const profilePictureUrl = image.data.urls.small;

  return { name, age, relationship, gender, height, password, about, avatarImage:profilePictureUrl, username, email, region, appearance };

}


  
export async function generateFemaleModerator() {
    const data = await generateRandomFemaleProfile();
    const createdData = createModerator(data)
    return createdData;
}

export async function generateMaleModerator() {
    const data = await generateRandomMaleProfile();
    const createdData = createModerator(data)

    console.log(createdData);
    return createdData;
}
