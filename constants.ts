
import type { Dinosaur, Achievement } from './types';

export const BASIC_ENVIRONMENTS = [
    "Prehistoric Fern Forest",
    "Dried-up Desert Riverbed",
    "Misty Swamp at Dawn",
    "Rocky Mountain Pass",
    "Dense Jungle with heavy rain",
    "Tropical Beach with storm clouds"
];

export const EXOTIC_ENVIRONMENTS = [
    "Volcanic Ashlands with flowing lava",
    "Frozen Tundra during a blizzard",
    "Bioluminescent Cave at night",
    "Meteor Impact Site with smoke",
    "Ancient Coral Reef",
    "Prehistoric Giant Mushroom Forest",
    "Primordial Emerald Jungle",
    "Floating Islands in the Sky",
    "Crystal Caverns",
    "Toxic Sulfur Pits"
];

export const ENVIRONMENTS = [...BASIC_ENVIRONMENTS, ...EXOTIC_ENVIRONMENTS];

// List of Dinos that should be locked behind Pro Pass
export const LEGENDARY_DINO_NAMES = [
    "Tyrannosaurus Rex",
    "Spinosaurus",
    "Giganotosaurus",
    "Indominus Rex", 
    "Mosasaurus",
    "Argentinosaurus",
    "Kronosaurus",
    "Carcharodontosaurus",
    "Dreadnoughtus",
    "Liopleurodon",
    "Dunkleosteus",
    "Sarcosuchus"
];

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_blood',
        title: 'First Discovery',
        description: 'Win your first battle.',
        icon: '🦕',
        condition: (stats) => stats.wins >= 1
    },
    {
        id: 'streak_3',
        title: 'Apex Predator',
        description: 'Win 3 battles in a row.',
        icon: '🔥',
        condition: (stats) => stats.currentStreak >= 3
    },
    {
        id: 'streak_10',
        title: 'Dino Dominator',
        description: 'Achieve a winning streak of 10.',
        icon: '👑',
        condition: (stats) => stats.currentStreak >= 10
    },
    {
        id: 'explorer',
        title: 'Paleontologist',
        description: 'Encounter 10 different dinosaurs.',
        icon: '🧭',
        condition: (stats) => stats.dinosDiscovered.length >= 10
    },
    {
        id: 'david_goliath',
        title: 'Giant Slayer',
        description: 'Win with a dinosaur smaller than the opponent.',
        icon: '⚔️',
        condition: (stats, battle) => {
            if (!battle || !battle.isCorrect) return false;
            return battle.winner.size < battle.loser.size;
        }
    },
    {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Win with a dinosaur that has over 50km/h speed.',
        icon: '⚡',
        condition: (stats, battle) => {
            if (!battle || !battle.isCorrect) return false;
            return battle.winner.speed >= 50;
        }
    },
    {
        id: 'tiny_terror',
        title: 'Tiny Terror',
        description: 'Win a battle with a dinosaur under 2m in size.',
        icon: '🐜',
        condition: (stats, battle) => {
            if (!battle || !battle.isCorrect) return false;
            return battle.winner.size <= 2;
        }
    }
];

// Helper to attach tiers to the raw data
const assignProperties = (dinos: Dinosaur[]): Dinosaur[] => {
    return dinos.map(d => ({
        ...d,
        tier: LEGENDARY_DINO_NAMES.includes(d.common) ? 'legendary' : 'common',
        affiliateLink: `https://www.amazon.com/s?k=${d.common.replace(' ', '+')}+toy+schleich`
    }));
};

const NEGATIVE_PROMPT_SUFFIX = "Negative: letterbox, black bars, cinematic bars, white borders, cropping, skeletons, bones, fossils, museum, flowers, text, blurry, distorted.";

const RAW_DINOSAURS: Dinosaur[] = [
    {
        common: "Tyrannosaurus Rex",
        scientific: "Tyrannosaurus rex",
        short_desc: "The crushing tyrant of the late Cretaceous forests.",
        detailed_info: "T. rex was one of the largest land carnivores, up to 12m long. It had binocular vision and could bite with 12,800 pounds of force. Lived ~68-66 million years ago. Fun fact: Despite tiny arms, its skull was a weapon of mass destruction!",
        size: 12,
        speed: 25,
        attack: 10,
        imagePrompt: `Cinematic wide landscape shot of a single Tyrannosaurus Rex roaring in a prehistoric forest. Massive skull, dappled sunlight on scales. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Earth',
        aliases: ["T-Rex", "Rex"]
    },
    {
        common: "Velociraptor",
        scientific: "Velociraptor mongoliensis",
        short_desc: "A sleek and deadly desert assassin.",
        detailed_info: "About 2m long, Velociraptor was feathered and agile, reaching speeds up to 60km/h. It hunted in packs and had a sickle-shaped claw on each foot. Lived ~75-71 million years ago. Fun fact: Smaller than movie portrayals—real ones were turkey-sized but deadly smart!",
        size: 2,
        speed: 60,
        attack: 7,
        imagePrompt: `Cinematic wide landscape shot of a single Velociraptor hunting on sand dunes. Feathered body, sharp eyes, bird-like stance. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth',
        aliases: ["Raptor"]
    },
    {
        common: "Triceratops",
        scientific: "Triceratops horridus",
        short_desc: "An armored tank with a trio of lethal horns.",
        detailed_info: "Up to 9m long, Triceratops had three facial horns and a bony frill for protection. It browsed low plants in herds. Lived ~68-66 million years ago. Fun fact: Its horns may have been for display or combat, like rhinos today—fossils show healed battle wounds!",
        size: 9,
        speed: 30,
        attack: 8,
        imagePrompt: `Cinematic wide landscape shot of a single Triceratops grazing in a meadow. Three horns, large bony frill, golden hour lighting. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth',
        aliases: ["Trike"]
    },
    {
        common: "Stegosaurus",
        scientific: "Stegosaurus stenops",
        short_desc: "A spiked fortress carrying a lethal tail weapon.",
        detailed_info: "Around 9m long, Stegosaurus had large back plates (possibly for thermoregulation or display) and tail spikes called a thagomizer. Lived ~155-150 million years ago. Fun fact: Its brain was walnut-sized, but that tail could shatter bones!",
        size: 9,
        speed: 10,
        attack: 6,
        imagePrompt: `Cinematic wide landscape shot of a single Stegosaurus walking through ferns. Large back plates, tail spikes ready. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Earth',
        aliases: ["Stego"]
    },
    {
        common: "Ankylosaurus",
        scientific: "Ankylosaurus magniventris",
        short_desc: "An unbreakable living tank with a bone-crushing club.",
        detailed_info: "About 6-8m long, covered in bony plates and spikes, with a tail club that could break legs. Lived ~68-66 million years ago. Fun fact: Its armor was so tough, even T. rex might struggle—its eyes were protected by horns!",
        size: 8,
        speed: 10,
        attack: 9,
        imagePrompt: `Cinematic wide landscape shot of a single Ankylosaurus. Heavily armored plating, clubbed tail, dusty textured skin. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Earth',
        aliases: ["Anky"]
    },
    {
        common: "Spinosaurus",
        scientific: "Spinosaurus aegyptiacus",
        short_desc: "A river monster with a massive sail.",
        detailed_info: "Up to 15m long (longer than T. rex), with a dorsal sail possibly for display or heat. Adapted for swimming. Lived ~112-93 million years ago. Fun fact: Largest known carnivorous dino—more fish-eater than land hunter!",
        size: 15,
        speed: 15,
        attack: 9,
        imagePrompt: `Cinematic wide landscape shot of a single Spinosaurus standing in a river. Massive sail completely visible, crocodile-like snout, full frame 16:9 view, no black bars, no cropping. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Water',
        aliases: ["Spino"]
    },
    {
        common: "Allosaurus",
        scientific: "Allosaurus fragilis",
        short_desc: "The relentless lion of the Jurassic age.",
        detailed_info: "Around 12m long, Allosaurus had strong legs for bursts of speed and could dislocate its jaw. Hunted large herbivores. Lived ~155-145 million years ago. Fun fact: Evidence of pack hunting—bite marks show it scavenged too!",
        size: 12,
        speed: 35,
        attack: 8,
        imagePrompt: `Cinematic wide landscape shot of a single Allosaurus stalking prey. Bipedal, sharp teeth, Jurassic forest background. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth',
        aliases: ["Allo"]
    },
    {
        common: "Giganotosaurus",
        scientific: "Giganotosaurus carolinii",
        short_desc: "A southern giant that hunted the largest land animals.",
        detailed_info: "Giganotosaurus measured up to 13.2m, making it one of the largest terrestrial carnivores. It had a slender, knife-like skull for slicing flesh from prey. Lived ~99-97 million years ago. Fun fact: It likely hunted giant sauropods, taking down prey many times its own size!",
        size: 13,
        speed: 50,
        attack: 10,
        imagePrompt: `Cinematic wide landscape shot of a single Giganotosaurus. Massive body, serrated teeth, arid South American landscape. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Earth',
        aliases: ["Giga"]
    },
    {
        common: "Pteranodon",
        scientific: "Pteranodon longiceps",
        short_desc: "The crested lord of the prehistoric skies.",
        detailed_info: "With a wingspan up to 7m, Pteranodon was a master of the skies, not a dinosaur. It was a fish-eater, diving to catch prey. Its distinctive crest may have been for display or steering. Lived ~86-84 million years ago. Fun fact: Pteranodon was toothless; its name means 'toothless wing'!",
        size: 7,
        speed: 80,
        attack: 5,
        imagePrompt: `Cinematic wide landscape shot of a single Pteranodon flying over the ocean. Large crest, wings spread wide. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Sky'
    },
    {
        common: "Brachiosaurus",
        scientific: "Brachiosaurus altithorax",
        short_desc: "A towering sentinel of the ancient forests.",
        detailed_info: "Brachiosaurus stood up to 16m tall and was around 26m long. Its front legs were longer than its hind legs, giving it a sloped back. It browsed on high foliage. Lived ~154-153 million years ago. Fun fact: For a long time, scientists thought it lived in water to support its weight, but it was fully terrestrial!",
        size: 26,
        speed: 15,
        attack: 4,
        imagePrompt: `Cinematic wide landscape shot of a single Brachiosaurus. Long neck reaching high trees, massive legs, peaceful atmosphere. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth',
        aliases: ["Brachio"]
    },
    {
        common: "Dilophosaurus",
        scientific: "Dilophosaurus wetherilli",
        short_desc: "A double-crested phantom of the early Jurassic.",
        detailed_info: "About 7m long, Dilophosaurus is recognized by the pair of rounded crests on its skull. It was a fast-moving bipedal carnivore. Lived ~193 million years ago. Fun fact: The venom-spitting and neck-frill seen in movies are fictional additions; the real animal was intimidating enough without them!",
        size: 7,
        speed: 40,
        attack: 6,
        imagePrompt: `Cinematic wide landscape shot of a single Dilophosaurus. Two distinct head crests, colorful scales, forest setting. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth'
    },
    {
        common: "Parasaurolophus",
        scientific: "Parasaurolophus walkeri",
        short_desc: "A trumpet-crested communicator of the plains.",
        detailed_info: "This 9.5m long hadrosaur is famous for its large, elaborate cranial crest. This hollow tube may have been used for communication through resonating sounds, for display, or for thermoregulation. Lived ~76-74 million years ago. Fun fact: Scientists have recreated the sound its crest could have made—a low, foghorn-like call!",
        size: 10,
        speed: 40,
        attack: 5,
        imagePrompt: `Cinematic wide landscape shot of a single Parasaurolophus drinking at a lake. Long backward-curving crest, sunset light. Full frame 16:9 view, no black bars, no cropping. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth',
        aliases: ["Para"]
    },
    {
        common: "Mosasaurus",
        scientific: "Mosasaurus hoffmannii",
        short_desc: "The unstoppable leviathan of the deep.",
        detailed_info: "The Mosasaurus was a true sea monster, growing up to 17m long. It wasn't a dinosaur but a giant aquatic lizard. It had a second set of teeth in its palate to ensure prey couldn't escape its grasp. Lived ~70-66 million years ago. Fun fact: Its powerful tail fin made it a swift and deadly ambush predator.",
        size: 17,
        speed: 50,
        attack: 10,
        imagePrompt: `Cinematic wide landscape shot of a single Mosasaurus underwater. Massive jaws open, light beams filtering through water. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Water',
        aliases: ["Mosa"]
    },
    {
        common: "Argentinosaurus",
        scientific: "Argentinosaurus huinculensis",
        short_desc: "A mountain that walked, shaking the earth.",
        detailed_info: "Argentinosaurus was a titanosaur sauropod, estimated to be 30-35m long and weighing up to 75 metric tons. It was a herbivore that used its long neck to reach high foliage. Lived ~97-93 million years ago. Fun fact: A single vertebra of Argentinosaurus was over 1.5 meters tall!",
        size: 35,
        speed: 8,
        attack: 3,
        imagePrompt: `Cinematic wide landscape shot of a single Argentinosaurus. Colossal scale, tiny trees in comparison, dusty plains. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth'
    },
    {
        common: "Carnotaurus",
        scientific: "Carnotaurus sastrei",
        short_desc: "A horned, sprinting demon of the south.",
        detailed_info: "Carnotaurus, meaning 'meat-eating bull,' was a lightly built carnivore about 8m long. Its most distinct features were the thick horns above its eyes and ridiculously small arms. Lived ~72-69 million years ago. Fun fact: Fossilized skin impressions show it had bumpy, scaly skin and was likely a very fast runner.",
        size: 8,
        speed: 55,
        attack: 8,
        imagePrompt: `Cinematic wide landscape shot of a single Carnotaurus sprinting. Bull-like horns, armored skin, motion blur. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth',
        aliases: ["Carno"]
    },
    {
        common: "Iguanodon",
        scientific: "Iguanodon bernissartensis",
        short_desc: "A versatile herbivore with a thumb-spike weapon.",
        detailed_info: "Iguanodon was a large ornithopod dinosaur, about 10m long. It could walk on two or four legs and possessed large thumb spikes, likely used for defense against predators. Lived ~126-122 million years ago. Fun fact: Iguanodon was one of the first three dinosaurs ever to be formally named, back in 1825.",
        size: 10,
        speed: 30,
        attack: 6,
        imagePrompt: `Cinematic wide landscape shot of a single Iguanodon standing on hind legs. Thumb spikes visible, lush vegetation. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Earth'
    },
    {
        common: "Archaeopteryx",
        scientific: "Archaeopteryx lithographica",
        short_desc: "The dawn-bird bridging reptiles and avians.",
        detailed_info: "Archaeopteryx, about the size of a raven, represents a crucial link between dinosaurs and birds. It had feathered wings but also retained sharp teeth and a long bony tail. Lived ~150 million years ago. Fun fact: It was likely not a strong flier and may have used its wings for short glides from tree to tree.",
        size: 1,
        speed: 20,
        attack: 2,
        imagePrompt: `Cinematic wide landscape shot of a single Archaeopteryx perched on a branch. Detailed feathers, toothed beak, ancient forest. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Sky'
    },
    {
        common: "Pachycephalosaurus",
        scientific: "Pachycephalosaurus wyomingensis",
        short_desc: "A bone-headed battering ram.",
        detailed_info: "Famous for its 9-inch thick skull dome surrounded by bony knobs. Likely used for flank-butting rivals rather than head-on collisions. Lived ~68-66 million years ago. Fun Fact: Its skull is often the only part fossilized!",
        size: 4.5,
        speed: 30,
        attack: 6,
        imagePrompt: `Cinematic wide landscape shot of a single Pachycephalosaurus. Domed skull, thick neck, rocky terrain. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth',
        aliases: ["Pachy"]
    },
    {
        common: "Therizinosaurus",
        scientific: "Therizinosaurus cheloniformis",
        short_desc: "The scythe-clawed reaper of the trees.",
        detailed_info: "Possessed the longest claws of any animal ever (up to 1m). Despite looking terrifying, it was a pot-bellied herbivore browsing tall vegetation. Lived ~70 million years ago. Fun Fact: Its name means 'scythe lizard'.",
        size: 10,
        speed: 20,
        attack: 8,
        imagePrompt: `Cinematic wide landscape shot of a single Therizinosaurus. Massive scythe-like claws, shaggy plumage, browsing trees. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Earth',
        aliases: ["Therizino"]
    },
    {
        common: "Baryonyx",
        scientific: "Baryonyx walkeri",
        short_desc: "A hooked-claw fisherman of the wetlands.",
        detailed_info: "A specialized fish-eater with a long, low skull and a heavy claw on each thumb. Stomach contents included fish scales and Iguanodon bones. Lived ~130-125 million years ago. Fun Fact: Its snout resembles a gharial's, perfectly adapted for snatching slippery prey.",
        size: 9,
        speed: 25,
        attack: 7,
        imagePrompt: `Cinematic wide landscape shot of a single Baryonyx fishing in a swamp. Crocodile-like snout, thumb claw ready. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Water'
    },
    {
        common: "Compsognathus",
        scientific: "Compsognathus longipes",
        short_desc: "A swarm of tiny, nimble hunters.",
        detailed_info: "One of the smallest dinosaurs, nimble and quick. It had sharp teeth and large eyes for hunting insects and lizards. Lived ~150 million years ago. Fun Fact: For decades, it was the smallest known dinosaur until others like Microraptor were found.",
        size: 1,
        speed: 60,
        attack: 2,
        imagePrompt: `Cinematic wide landscape shot of a single Compsognathus. Tiny, sleek, detailed scales, low angle perspective. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth',
        aliases: ["Compy"]
    },
    {
        common: "Diplodocus",
        scientific: "Diplodocus carnegii",
        short_desc: "A whip-cracking giant of the plains.",
        detailed_info: "An immense sauropod with a whip-like tail that could crack the sound barrier. Its teeth were peg-like for stripping leaves. Lived ~154-152 million years ago. Fun Fact: It couldn't lift its neck very high; it held it horizontally like a suspension bridge.",
        size: 25,
        speed: 12,
        attack: 5,
        imagePrompt: `Cinematic wide landscape shot of a single Diplodocus. Long horizontal neck, whip tail, vast plains. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth'
    },
    {
        common: "Ceratosaurus",
        scientific: "Ceratosaurus nasicornis",
        short_desc: "A horned dragon prowling the Jurassic.",
        detailed_info: "A primitive carnivore with a prominent horn on its nose and osteoderms down its back. It competed with Allosaurus. Lived ~153-148 million years ago. Fun Fact: Its teeth were exceptionally long relative to its skull size.",
        size: 6,
        speed: 30,
        attack: 7,
        imagePrompt: `Cinematic wide landscape shot of a single Ceratosaurus. Horned nose, large teeth, row of osteoderms on back. Full frame 16:9 view, no black bars, no cropping. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Earth'
    },
    {
        common: "Styracosaurus",
        scientific: "Styracosaurus albertensis",
        short_desc: "A spiked shield-wall on legs.",
        detailed_info: "A relative of Triceratops with a spectacular frill adorned with long spikes and a single massive nose horn. Lived ~75 million years ago. Fun Fact: The frill spikes likely served as a warning signal to rivals and predators.",
        size: 5.5,
        speed: 25,
        attack: 8,
        imagePrompt: `Cinematic wide landscape shot of a single Styracosaurus. Large nose horn, spiked frill. Full frame 16:9 view, no black bars, no cropping. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth'
    },
    {
        common: "Plesiosaurus",
        scientific: "Plesiosaurus dolichodeirus",
        short_desc: "A serpent-necked wraith of the ocean.",
        detailed_info: "A marine reptile that 'flew' underwater using four wing-like flippers. Its long neck allowed it to ambush fish schools. Lived ~200-175 million years ago. Fun Fact: It inspired the Loch Ness Monster legends, though it couldn't lift its neck swan-like out of water.",
        size: 3.5,
        speed: 20,
        attack: 5,
        imagePrompt: `Cinematic wide landscape shot of a single Plesiosaurus gliding underwater. Long neck, four flippers, blue ocean depth. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Water',
        aliases: ["Nessie"]
    },
    {
        common: "Gallimimus",
        scientific: "Gallimimus bullatus",
        short_desc: "The fastest sprinter of the badlands.",
        detailed_info: "The largest 'chicken mimic,' it was toothless with a keratinous beak. It used speed to outrun T-Rex ancestors. Lived ~70 million years ago. Fun Fact: It likely had a lifestyle similar to modern ostriches, eating plants and small animals.",
        size: 6,
        speed: 80,
        attack: 3,
        imagePrompt: `Cinematic wide landscape shot of a single Gallimimus running. Ostrich-like body, long legs, open plains. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth'
    },
    {
        common: "Microraptor",
        scientific: "Microraptor zhaoianus",
        short_desc: "A four-winged phantom of the canopy.",
        detailed_info: "A revolutionary discovery showing a dinosaur with four wings (feathers on legs too). It was an arboreal glider. Lived ~120 million years ago. Fun Fact: Its feathers were iridescent black, like a crow or grackle.",
        size: 0.8,
        speed: 30,
        attack: 3,
        imagePrompt: `Cinematic wide landscape shot of a single Microraptor gliding between trees. Four wings visible, iridescent feathers. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Sky'
    },
    {
        common: "Utahraptor",
        scientific: "Utahraptor ostrommaysi",
        short_desc: "The heavyweight champion of the raptors.",
        detailed_info: "At 7m long and weighing 500kg, Utahraptor was the largest dromaeosaur. Its killing claw was over 20cm long. Lived ~126 million years ago. Fun Fact: It was big enough to hunt large dinosaurs like Iguanodon solo.",
        size: 7,
        speed: 40,
        attack: 9,
        imagePrompt: `Cinematic wide landscape shot of a single Utahraptor. Heavy build, feathers, massive foot claws. Full frame 16:9 view, no black bars, no cropping. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth'
    },
    {
        common: "Quetzalcoatlus",
        scientific: "Quetzalcoatlus northropi",
        short_desc: "The giraffe-sized dragon of the skies.",
        detailed_info: "With a wingspan of 10-11m, this was one of the largest flying animals of all time. On the ground, it stalked prey like a giant stork. Lived ~68-66 million years ago. Fun Fact: It could likely launch itself into the air from a standing start using its powerful forelimbs.",
        size: 11,
        speed: 80,
        attack: 7,
        imagePrompt: `Cinematic wide landscape shot of a single Quetzalcoatlus taking flight. Enormous wingspan, long beak, cloudy sky. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Sky',
        aliases: ["Quetzal"]
    },
    {
        common: "Amargasaurus",
        scientific: "Amargasaurus cazaui",
        short_desc: "A spiny-necked walker of the south.",
        detailed_info: "A smaller sauropod (10m) distinguished by long neural spines on its neck, which may have supported a skin sail or been exposed horn. Lived ~129-122 million years ago. Fun Fact: Unlike other sauropods, it likely had a shorter neck relative to its body size.",
        size: 10,
        speed: 15,
        attack: 5,
        imagePrompt: `Cinematic wide landscape shot of a single Amargasaurus. Double row of neck spines, lush vegetation, full frame 16:9 view, no black bars, no cropping. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth'
    },
    {
        common: "Corythosaurus",
        scientific: "Corythosaurus casuarius",
        short_desc: "A helmet-crested browser.",
        detailed_info: "A hadrosaur known for its semi-circular crest, which resembles a Corinthian helmet. The crest was likely used for vocalization and display. Lived ~77-75 million years ago. Fun Fact: Its skin texture is well-known from fossils, showing pebbly scales.",
        size: 9,
        speed: 30,
        attack: 4,
        imagePrompt: `Cinematic wide landscape shot of a single Corythosaurus. Round helmet crest, pebbly skin texture, feeding. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth'
    },
    {
        common: "Kentrosaurus",
        scientific: "Kentrosaurus aethiopicus",
        short_desc: "A prickly fortress of spikes.",
        detailed_info: "Smaller than Stegosaurus (4.5m), but arguably more dangerous due to the long spikes on its shoulders and tail. Lived ~152 million years ago. Fun Fact: It had an unusually flexible tail, allowing it to swing its spikes in a wide arc.",
        size: 4.5,
        speed: 12,
        attack: 7,
        imagePrompt: `Cinematic wide landscape shot of a single Kentrosaurus in a prehistoric fern forest. Long shoulder spikes, tail spikes, defensive posture. Full frame 16:9 view, no black bars, no cropping. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Earth'
    },
    {
        common: "Suchomimus",
        scientific: "Suchomimus tenerensis",
        short_desc: "A crocodile-faced river stalker.",
        detailed_info: "A spinosaurid with a very long, narrow skull and hooked claws. Unlike Spinosaurus, it lacked a large sail. Lived ~125-112 million years ago. Fun Fact: Its name means 'crocodile mimic', referring to its adapted snout.",
        size: 11,
        speed: 25,
        attack: 8,
        imagePrompt: `Cinematic wide landscape shot of a single Suchomimus. Long narrow snout, low ridge on back, river bank. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Water'
    },
    {
        common: "Pachyrhinosaurus",
        scientific: "Pachyrhinosaurus canadensis",
        short_desc: "A boss-nosed brawler.",
        detailed_info: "Instead of a nose horn, it had a thick, flattened boss of bone. This was likely used for flank-butting rivals rather than head-on collisions. Lived ~73-69 million years ago. Fun Fact: It may have had a keratin horn growing from the boss, but the bone itself is flat.",
        size: 6,
        speed: 25,
        attack: 6,
        imagePrompt: `Cinematic wide landscape shot of a single Pachyrhinosaurus. Thick nose boss, sturdy build, snowy forest. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth'
    },
    {
        common: "Kronosaurus",
        scientific: "Kronosaurus queenslandicus",
        short_desc: "The car-sized jaws of the southern ocean.",
        detailed_info: "A pliosaur, not a dinosaur, that ruled the southern polar seas. It had a short neck and a huge skull (over 2m long). Lived ~120-100 million years ago. Fun Fact: Named after Kronos, the Greek titan who ate his own children.",
        size: 10,
        speed: 40,
        attack: 10,
        imagePrompt: `Cinematic wide landscape shot of a single Kronosaurus. Huge jaws, short neck, powerful flippers, dark water. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Water'
    },
    {
        common: "Deinocheirus",
        scientific: "Deinocheirus mirificus",
        short_desc: "A gentle giant with terrifying arms.",
        detailed_info: "For years known only by its huge arms. It turned out to be a hump-backed, duck-billed omnivore that ate plants and fish. Lived ~70 million years ago. Fun Fact: It looked like a mix between a camel, a duck, and a dinosaur.",
        size: 11,
        speed: 20,
        attack: 7,
        imagePrompt: `Cinematic wide landscape shot of a single Deinocheirus. Hump back, duck bill, massive arms, swampy terrain. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Earth'
    },
    {
        common: "Carcharodontosaurus",
        scientific: "Carcharodontosaurus saharicus",
        short_desc: "The shark-toothed titan of Africa.",
        detailed_info: "A rival to Spinosaurus, this 'shark-toothed lizard' was a massive terrestrial killing machine, up to 13m long. Lived ~100-94 million years ago. Fun Fact: Its skull could be up to 1.6 meters long.",
        size: 12,
        speed: 35,
        attack: 9,
        imagePrompt: `Cinematic wide landscape shot of a single Carcharodontosaurus. Serrated teeth, large head, desert heat waves. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Earth'
    },
    {
        common: "Gorgosaurus",
        scientific: "Gorgosaurus libratus",
        short_desc: "A sleek tyrannosaur built for the chase.",
        detailed_info: "Smaller and faster than T. rex, Gorgosaurus was an apex predator of its time. It had long legs built for running down swift prey like hadrosaurs. Lived ~76-75 million years ago. Fun Fact: It frequently suffered from bone fractures and face infections.",
        size: 9,
        speed: 48,
        attack: 8,
        imagePrompt: `Cinematic wide landscape shot of a single Gorgosaurus prowling through a cretaceous forest. Sleek muscular build, vibrant scales, hunting posture. Full frame 16:9 view, no black bars, no cropping. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Earth',
        aliases: ["Gorgo"]
    },
    {
        common: "Edmontosaurus",
        scientific: "Edmontosaurus annectens",
        short_desc: "The colossal grazer of the Hell Creek.",
        detailed_info: "A giant hadrosaur that roamed in huge herds. Some mummies show it had a fleshy crest on its head (like a rooster). It was a primary food source for T. rex. Lived ~68-66 million years ago. Fun Fact: It had thousands of teeth that were constantly replaced.",
        size: 12,
        speed: 45,
        attack: 5,
        imagePrompt: `Cinematic wide landscape shot of a single Edmontosaurus. Fleshy head crest, pine forest, grazing. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth'
    },
    {
        common: "Troodon",
        scientific: "Troodon formosus",
        short_desc: "A nocturnal mastermind.",
        detailed_info: "A small, bird-like predator with binocular vision and grasping hands. Its brain-to-body ratio was comparable to modern birds. Lived ~77 million years ago. Fun Fact: Its large eyes suggest it was a nocturnal hunter.",
        size: 2,
        speed: 40,
        attack: 5,
        imagePrompt: `Cinematic wide landscape shot of a single Troodon hunting at night. Glowing large eyes, feathers, intelligent expression. Full frame 16:9 view, no black bars, no cropping. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth'
    },
    {
        common: "Albertosaurus",
        scientific: "Albertosaurus sarcophagus",
        short_desc: "The fleet-footed terror of the north.",
        detailed_info: "A close relative of T. rex but leaner and possibly faster. Mass graves suggest they may have lived and hunted in family groups. Lived ~70 million years ago. Fun Fact: Juvenile Albertosaurus were likely much faster than adults.",
        size: 10,
        speed: 40,
        attack: 9,
        imagePrompt: `Cinematic wide landscape shot of a single Albertosaurus. Rugged snout, lean muscular build, rocky terrain. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Earth',
        aliases: ["Alberto"]
    },
    {
        common: "Megalosaurus",
        scientific: "Megalosaurus bucklandii",
        short_desc: "The first titan ever named.",
        detailed_info: "A large meat-eater from the Middle Jurassic of England. Historically significant as the first named dinosaur (1824). Lived ~166 million years ago. Fun Fact: Early reconstructions depicted it as a giant 4-legged lizard!",
        size: 9,
        speed: 30,
        attack: 8,
        imagePrompt: `Cinematic wide landscape shot of a single Megalosaurus. Jurassic theropod, heavy build, overcast English prehistoric landscape. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Earth'
    },
    {
        common: "Acrocanthosaurus",
        scientific: "Acrocanthosaurus atokensis",
        short_desc: "A high-spined giant killer.",
        detailed_info: "This 'high-spined lizard' was an apex predator of North America. Its distinct ridge likely supported massive neck muscles for tearing prey. Lived ~112 million years ago. Fun Fact: Footprints show it stalking massive sauropods in Texas.",
        size: 11.5,
        speed: 35,
        attack: 9,
        imagePrompt: `Cinematic wide landscape shot of a single Acrocanthosaurus. High spine ridge, muscular neck, swampy environment, full frame 16:9 view, no black bars, no cropping. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Earth',
        aliases: ["Acro"]
    },
    {
        common: "Cryolophosaurus",
        scientific: "Cryolophosaurus ellioti",
        short_desc: "The crested king of Antarctica.",
        detailed_info: "Found in Antarctica (which was warmer then), this predator had a forward-curling crest used for display. It was the largest carnivore of its time. Lived ~190 million years ago. Fun Fact: Its nickname is the 'Elvisaurus' due to its hair-style crest.",
        size: 6.5,
        speed: 30,
        attack: 7,
        imagePrompt: `Cinematic wide landscape shot of a single Cryolophosaurus. Unique forward-curling head crest, antarctic forest. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth'
    },
    {
        common: "Ouranosaurus",
        scientific: "Ouranosaurus nigeriensis",
        short_desc: "A sail-backed oasis wanderer.",
        detailed_info: "This grazer had tall neural spines forming a sail, likely for heat regulation in the hot Cretaceous climate. It had a duck-like beak. Lived ~110 million years ago. Fun Fact: Its sail is similar to Spinosaurus, who lived in the same region.",
        size: 8,
        speed: 25,
        attack: 5,
        imagePrompt: `Cinematic wide landscape shot of a single Ouranosaurus. Tall back sail, duck-bill, river bank. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Earth'
    },
    {
        common: "Herrerasaurus",
        scientific: "Herrerasaurus ischigualastensis",
        short_desc: "A primitive prototype of the predators to come.",
        detailed_info: "Living 230 million years ago, it was a pioneer of the dinosaur reign. It had a sliding jaw joint to grasp struggling prey. Fun Fact: It lived before the giant sauropods and T-rex existed.",
        size: 4,
        speed: 45,
        attack: 6,
        imagePrompt: `Cinematic wide landscape shot of a single Herrerasaurus. Primitive theropod features, agile stance, Triassic landscape. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth'
    },
    {
        common: "Deinonychus",
        scientific: "Deinonychus antirrhopus",
        short_desc: "The terrible claw that redefined dinosaurs.",
        detailed_info: "Deinonychus means 'terrible claw'. It hunted in packs and could leap onto prey, latching on with its sickles. Lived ~115-108 million years ago. Fun Fact: Discovery of this active predator changed the view of dinosaurs from sluggish lizards to dynamic animals.",
        size: 3.4,
        speed: 50,
        attack: 8,
        imagePrompt: `Cinematic wide landscape shot of a single Deinonychus. Feathered, large sickle claw visible, dynamic pose. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth'
    },
    {
        common: "Brontosaurus",
        scientific: "Brontosaurus excelsus",
        short_desc: "The thunder lizard that shook the earth.",
        detailed_info: "The 'thunder lizard' is a distinct genus of sauropod known for its massive size and thick neck. It was one of the largest animals to walk the earth. Lived ~154-150 million years ago. Fun fact: For nearly a century, it was considered the same as Apatosaurus until a 2015 study restored its name!",
        size: 22,
        speed: 10,
        attack: 6,
        imagePrompt: `Cinematic wide landscape shot of a single Brontosaurus. Heavy build, thick neck, grazing on tall trees. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth',
        aliases: ["Apatosaurus"]
    },
    {
        common: "Maiasaura",
        scientific: "Maiasaura peeblesorum",
        short_desc: "The nurturing mother of the plains.",
        detailed_info: "Maiasaura lived in large herds and raised its young in nesting colonies, providing evidence of parental care in dinosaurs. Lived ~76.7 million years ago. Fun fact: Its name is one of the few female-gendered dinosaur names.",
        size: 9,
        speed: 25,
        attack: 4,
        imagePrompt: `Cinematic wide landscape shot of a single Maiasaura tending a nest. Gentle expression, herd in background. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth'
    },
    {
        common: "Oviraptor",
        scientific: "Oviraptor philoceratops",
        short_desc: "The devoted guardian, falsely accused.",
        detailed_info: "Oviraptor had a short beak and a crest. Fossils were found atop eggs, leading to the 'egg thief' misnomer, but they were likely brooding their own eggs. Lived ~75 million years ago. Fun fact: It likely had colorful feathers for display.",
        size: 1.5,
        speed: 50,
        attack: 6,
        imagePrompt: `Cinematic wide landscape shot of a single Oviraptor sitting on a nest. Feathered, head crest, beak. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth'
    },
    {
        common: "Plateosaurus",
        scientific: "Plateosaurus engelhardti",
        short_desc: "The heavy-clawed pioneer of size.",
        detailed_info: "An early sauropodomorph that could walk on two legs or four. It had strong thumb claws for defense or digging. Lived ~214-204 million years ago. Fun fact: It is one of the most common dinosaur fossils found in Europe.",
        size: 8,
        speed: 20,
        attack: 5,
        imagePrompt: `Cinematic wide landscape shot of a single Plateosaurus. Bipedal stance, long neck, thumb claws. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Earth'
    },
    {
        common: "Tarbosaurus",
        scientific: "Tarbosaurus bataar",
        short_desc: "The crushing tyrant of the Gobi.",
        detailed_info: "Dominating the Gobi Desert, Tarbosaurus was extremely similar to T. rex but had a slightly more slender skull. Lived ~70 million years ago. Fun fact: Some scientists argue it is actually just an Asian species of Tyrannosaurus.",
        size: 10,
        speed: 30,
        attack: 9,
        imagePrompt: `Cinematic wide landscape shot of a single Tarbosaurus. Tyrannosaurid build, desert environment, menacing. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Earth'
    },
    {
        common: "Dreadnoughtus",
        scientific: "Dreadnoughtus schrani",
        short_desc: "A titan that feared nothing.",
        detailed_info: "Dreadnoughtus was one of the largest terrestrial animals ever, weighing around 65 tons. Its name means 'fears nothing,' as fully grown adults had no natural predators. Lived ~77 million years ago. Fun fact: It was so massive that it likely spent most of its time just eating to fuel its body.",
        size: 26,
        speed: 5,
        attack: 6,
        imagePrompt: `Cinematic wide landscape shot of a single Dreadnoughtus. Unimaginably large, thick neck, filling the frame. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth'
    },
    {
        common: "Yutyrannus",
        scientific: "Yutyrannus huali",
        short_desc: "The woolly tyrant of the ice.",
        detailed_info: "Yutyrannus is the largest known dinosaur with direct evidence of feathers. It was a 9-meter long predator that lived in a cooler climate. Lived ~125 million years ago. Fun fact: Its discovery confirmed that giant tyrannosaurs could indeed be feathered.",
        size: 9,
        speed: 30,
        attack: 8,
        imagePrompt: `Cinematic wide landscape shot of a single Yutyrannus in a snowy forest. Thick shaggy feathers, breath visible in cold air. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Earth'
    },
    {
        common: "Majungasaurus",
        scientific: "Majungasaurus crenatissimus",
        short_desc: "The cannibal king of Madagascar.",
        detailed_info: "Majungasaurus was an abelisaurid with a short, broad skull and a single dome-like horn. Fossil evidence suggests it engaged in cannibalism. Lived ~70-66 million years ago. Fun fact: It had very short legs and tiny arms, even smaller than T. rex relative to body size.",
        size: 7,
        speed: 25,
        attack: 8,
        imagePrompt: `Cinematic wide landscape shot of a single Majungasaurus. Short blunt snout, single head horn, tropical setting. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Earth'
    },
    {
        common: "Concavenator",
        scientific: "Concavenator corcovatus",
        short_desc: "The humped hunter of Spain.",
        detailed_info: "This Early Cretaceous theropod had a unique pointed hump on its back, possibly for display or thermoregulation. It also had quill knobs on its forearms. Lived ~130 million years ago. Fun fact: Its name means 'hump-backed hunter from Cuenca'.",
        size: 6,
        speed: 35,
        attack: 7,
        imagePrompt: `Cinematic wide landscape shot of a single Concavenator. Distinct triangular back hump, forearm quills. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth'
    },
    {
        common: "Sinoceratops",
        scientific: "Sinoceratops zhuchengensis",
        short_desc: "The crowned herbivore of the East.",
        detailed_info: "Sinoceratops is the only known ceratopsid from Asia. It had a short nose horn and a distinctive frill adorned with hook-like hornlets. Lived ~73 million years ago. Fun fact: It became famous in pop culture for its unique 'crown' of frill hooks.",
        size: 6,
        speed: 25,
        attack: 7,
        imagePrompt: `Cinematic wide landscape shot of a single Sinoceratops standing in a dense prehistoric jungle. Distinct frill with curved hooks, massive build. Full frame 16:9 view, no black bars, no cropping. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth'
    },
    {
        common: "Dimetrodon",
        scientific: "Dimetrodon limbatus",
        short_desc: "The sail-backed pioneer of the Permian.",
        detailed_info: "Living millions of years before the first dinosaur, Dimetrodon was a predator with a large spinal sail used for temperature regulation. Lived ~295-272 million years ago. Fun fact: It is actually more closely related to mammals than to dinosaurs!",
        size: 3.5,
        speed: 15,
        attack: 5,
        imagePrompt: `Cinematic wide landscape shot of a single Dimetrodon. Large spinal sail, splayed legs, red desert rocks. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Earth'
    },
    {
        common: "Pyroraptor",
        scientific: "Pyroraptor olympius",
        short_desc: "The fire thief of Olympus.",
        detailed_info: "A small, bird-like predator found in the foothills of Mont Olympe. It had large curved claws and was likely fully feathered. Lived ~70 million years ago. Fun fact: Recent movies depicted it swimming under ice, though fossils don't confirm this ability.",
        size: 2.5,
        speed: 45,
        attack: 7,
        imagePrompt: `Cinematic wide landscape shot of a single Pyroraptor. Reddish feathers, agile pose, forest undergrowth. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Water'
    },
    {
        common: "Protoceratops",
        scientific: "Protoceratops andrewsi",
        short_desc: "The gritty survivor of the dunes.",
        detailed_info: "Protoceratops was a common ceratopsian in the Gobi Desert. It lacked horns but had a strong beak and a wide frill. Lived ~75-71 million years ago. Fun fact: The famous 'Fighting Dinosaurs' fossil shows one locked in mortal combat with a Velociraptor.",
        size: 2,
        speed: 25,
        attack: 4,
        imagePrompt: `Cinematic wide landscape shot of a single Protoceratops. Large frill, beak, desert dunes. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'triceratops_bellow',
        element: 'Earth'
    },
    {
        common: "Coelophysis",
        scientific: "Coelophysis bauri",
        short_desc: "The slender ghost of the Triassic.",
        detailed_info: "Living in the Late Triassic, Coelophysis was a lightweight carnivore with hollow bones (hence its name 'hollow form'). Lived ~203-196 million years ago. Fun fact: Thousands of skeletons were found together at Ghost Ranch, New Mexico, suggesting a mass death event.",
        size: 3,
        speed: 40,
        attack: 4,
        imagePrompt: `Cinematic wide landscape shot of a single Coelophysis. Slender snake-like necks, agile, arid landscape. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth'
    },
    {
        common: "Liopleurodon",
        scientific: "Liopleurodon ferox",
        short_desc: "The magical giant of the deep.",
        detailed_info: "A giant pliosaur that was the apex predator of the Jurassic seas. While TV shows exaggerated its size to 25m, real estimates are closer to 7-10m, still terrifying. Lived ~166-155 million years ago. Fun fact: It could smell underwater using directional sniffing.",
        size: 10,
        speed: 35,
        attack: 9,
        imagePrompt: `Cinematic wide landscape shot of a single Liopleurodon swimming. Distinct black and white patterns, four flippers, deep blue sea. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Water'
    },
    {
        common: "Mapusaurus",
        scientific: "Mapusaurus roseae",
        short_desc: "The giant-slayer of Patagonia.",
        detailed_info: "A massive carcharodontosaurid that hunted in gangs to take down the colossal Argentinosaurus. Lived ~97-93 million years ago. Fun fact: Its name means 'Earth Lizard', and discovery sites suggest they lived and hunted together.",
        size: 12,
        speed: 30,
        attack: 9,
        imagePrompt: `Cinematic wide landscape shot of a single Mapusaurus solitary hunter. Large head, arid prehistoric plains. Full frame 16:9 view, no black bars, no cropping. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'trex_roar',
        element: 'Earth',
        aliases: ["Mapu"]
    },
    {
        common: "Nothosaurus",
        scientific: "Nothosaurus mirabilis",
        short_desc: "The seal-lizard of the Triassic shores.",
        detailed_info: "A semi-aquatic reptile that lived like a modern seal, hunting fish in the water but resting on rocks. Lived ~240-210 million years ago. Fun fact: Its teeth were long and interlocking, perfect for trapping slippery fish.",
        size: 4,
        speed: 25,
        attack: 6,
        imagePrompt: `Cinematic wide landscape shot of a single Nothosaurus on a shoreline. Semi-aquatic, long neck, sharp teeth, wet skin. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Water'
    },
    {
        common: "Dunkleosteus",
        scientific: "Dunkleosteus terrelli",
        short_desc: "The armored tank of the Devonian seas.",
        detailed_info: "Not a dinosaur, but a 1-ton armored fish with self-sharpening bony plates instead of teeth. Lived ~358-382 million years ago. Fun fact: It had one of the strongest bite forces of all time, able to shear through other armored prey.",
        size: 8,
        speed: 20,
        attack: 10,
        imagePrompt: `Cinematic wide landscape shot of a single Dunkleosteus underwater. Armored placoderm fish, massive shearing jaws, murky depth. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Water',
        aliases: ["Dunk"]
    },
    {
        common: "Sarcosuchus",
        scientific: "Sarcosuchus imperator",
        short_desc: "The SuperCroc that ate dinosaurs.",
        detailed_info: "A colossal relative of crocodiles, weighing up to 8 tons. It lived in river deltas and ambushed dinosaurs that came to drink. Lived ~112 million years ago. Fun fact: Its snout ended in a bulbous 'bulla', likely used for vocalization or smell.",
        size: 12,
        speed: 15,
        attack: 9,
        imagePrompt: `Cinematic wide landscape shot of a single Sarcosuchus in a river. Giant crocodile, armored scales, basking or swimming. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'generic_roar',
        element: 'Water',
        aliases: ["SuperCroc"]
    },
    {
        common: "Gigantoraptor",
        scientific: "Gigantoraptor erlianensis",
        short_desc: "The colossal bird of the desert.",
        detailed_info: "The largest bird-like dinosaur, standing over 5m tall. Despite its terrifying size, it was likely an omnivore or herbivore. Lived ~85 million years ago. Fun fact: It was covered in feathers and sat on a nest of massive eggs.",
        size: 8,
        speed: 30,
        attack: 7,
        imagePrompt: `Cinematic wide landscape shot of a single Gigantoraptor. Giant oviraptorosaur, colorful feathers, beak, nesting ground. Full frame 16:9 view, no black bars. ${NEGATIVE_PROMPT_SUFFIX}`,
        soundKey: 'raptor_screech',
        element: 'Earth'
    }
];

export const DINOSAURS = assignProperties(RAW_DINOSAURS);
