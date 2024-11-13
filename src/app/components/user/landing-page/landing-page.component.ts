import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('featureAnimation', [
      state('inactive', style({ opacity: 0.7, transform: 'scale(1)' })),
      state('active', style({ opacity: 1, transform: 'scale(1.05)' })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ]),
    trigger('staggered', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger('100ms', [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class LandingPageComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  currentYear = new Date().getFullYear();
  chatMessages: { text: string; sender: string; state: string }[] = [];
  demoMessages: { text: string; sender: string }[] = [
    { text: "Welcome to Klio! How can I assist you today?", sender: "bot" }
  ];
  userInput = '';
  isScrolled = false;

  navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Demo', href: '#demo' },
    { label: 'Pricing', href: '#' },
    { label: 'About', href: '#' }
  ];

  features = [
    {
      title: 'Real-time Chat',
      description: 'Experience seamless, instant messaging with your team. Share ideas, files, and emojis in a flash.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />',
      state: 'inactive'
    },
    {
      title: 'Voice & Video Calls',
      description: 'Crystal-clear audio and high-quality video conferencing. Connect face-to-face from anywhere.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />',
      state: 'inactive'
    },
    {
      title: 'File Sharing',
      description: 'Easily share and organize files within your team. Access your documents from any device, anytime.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />',
      state: 'inactive'
    }
  ];

  testimonials = [
    {
      quote: "Klio has transformed how our team communicates. It's intuitive, fast, and packed with features!",
      name: "Alex Johnson",
      role: "Product Manager",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      quote: "The integration capabilities are outstanding. Klio fits perfectly into our existing workflow.",
      name: "Sarah Lee",
      role: "Software Developer",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    {
      quote: "As we scaled our startup, Klio scaled with us. It's been integral to our growth and collaboration.",
      name: "Michael Chen",
      role: "Startup Founder",
      avatar: "/placeholder.svg?height=40&width=40"
    }
  ];

  footerLinks = [
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Security', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'Docs', href: '#' },
    { label: 'Contact', href: '#' }
  ];

  socialIcons = [
    {
      href: '#',
      svg: '<path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />'
    },
    {
      href: '#',
      svg: '<path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />'
    },
    {
      href: '#',
      svg: '<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />'
    },
    {
      href: '#',
      svg: '<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />'
    }
  ];

  bubbles = Array(20).fill(0).map(() => ({
    size: Math.random() * 50 + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: ['#7289da', '#43b581', '#faa61a'][Math.floor(Math.random() * 3)],
    duration: Math.random() * 10 + 5
  }));

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
  }

  ngOnInit() {
    this.animateChat();
  }

  animateChat() {
    const messages = [
      { text: "Hey team, how's the new project coming along?", sender: "user" },
      { text: "It's going great! We just finished the first milestone.", sender: "bot" },
      { text: "Awesome! Can you share the latest designs?", sender: "user" },
      { text: "Sure thing! I've uploaded them to our shared folder.", sender: "bot" },
      { text: "Perfect, I'll take a look. Thanks!", sender: "user" }
    ];

    messages.forEach((message, index) => {
      setTimeout(() => {
        this.chatMessages.push({ ...message, state: 'in' });
      }, index * 1500);
    });
  }

  activateFeature(index: number) {
    this.features.forEach((feature, i) => {
      feature.state = i === index ? 'active' : 'inactive';
    });
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.demoMessages.push({ text: this.userInput, sender: 'user' });
      this.userInput = '';
      setTimeout(() => {
        this.demoMessages.push({ text: "Thanks for your message! Our team will get back to you soon.", sender: 'bot' });
        this.scrollToBottom();
      }, 1000);
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch(err) {}
    }, 100);
  }
}
