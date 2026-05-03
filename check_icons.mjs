
import * as Lucide from 'lucide-react';
console.log(Object.keys(Lucide).filter(key => 
  ['Facebook', 'Twitter', 'Instagram', 'Linkedin', 'Github'].some(name => 
    key.toLowerCase().includes(name.toLowerCase())
  )
));
