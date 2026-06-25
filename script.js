const textToType = "Sana olan sevgimi sadece fotoğraflara sığdıramam.\nBelki kelimeler de yetmez ama...\nBu karanlıkta bile her adımımda seni görüyorum.\n\nIşığı yakmak için ekranda gezin...";
const typewriterElement = document.getElementById('typewriter-text');
const interactionLayer = document.getElementById('interaction-layer');

// Plak Çalar Elementleri
const turntableModal = document.getElementById('turntable-modal');
const closeModalBtn = document.getElementById('close-modal');
const vinyl = document.getElementById('vinyl');
const vinylCover = document.getElementById('vinyl-cover');
const tonearm = document.getElementById('tonearm');
const audioPlayer = document.getElementById('audio-player');
const nowPlayingText = document.getElementById('now-playing-text');
const skipForwardBtn = document.getElementById('skip-forward-btn');

// Arka Plan Müziği Ayarları
const bgAudio = new Audio('music/bg_music.mp3');
bgAudio.loop = true;
bgAudio.volume = 0.5; // Ses seviyesi yarı yarıya (plak çalarken kapanacak)

let hasStartedBgMusic = false;
const startBgMusic = () => {
    if (!hasStartedBgMusic) {
        bgAudio.play().catch(e => console.log("Otomatik oynatma engellendi."));
        hasStartedBgMusic = true;
    }
};

// Sayfayla ilk etkileşime geçildiğinde arka plan müziğini başlat
document.body.addEventListener('mousemove', startBgMusic, {once: true});
document.body.addEventListener('touchstart', startBgMusic, {once: true});

let charIndex = 0;
// Yazının bitip bitmediğini kontrol eden değişken
let isTypingFinished = false; 

// 1. Daktilo Efekti Fonksiyonu
function typeWriter() {
    if (charIndex < textToType.length) {
        // Alt satıra geçme karakterini yakala
        if(textToType.charAt(charIndex) === '\n') {
             typewriterElement.innerHTML += '<br>';
        } else {
            typewriterElement.innerHTML += textToType.charAt(charIndex);
        }
        charIndex++;
        // Rastgele gecikme süresi ile gerçek insan yazıyormuş hissi (50ms - 100ms arası)
        setTimeout(typeWriter, Math.random() * 50 + 50);
    } else {
        isTypingFinished = true;
        // Yazı bittikten 3 saniye sonra ana metni yavaşça tamamen silelim
        setTimeout(() => {
            const container = document.querySelector('.center-text-container');
            container.style.transition = 'opacity 3s ease';
            container.style.opacity = '0';
            
            // Tamamen şeffaf olduktan sonra ekrandan da (HTML) kaldıralım ki tıklamalara engel olmasın
            setTimeout(() => {
                container.style.display = 'none';
                
                // Mektup silindikten hemen sonra parlayan yazıyı göster
                const glowingText = document.getElementById('glowing-text');
                glowingText.classList.add('show-glow');
                
                // 5 saniye parladıktan sonra o da yavaşça silinsin
                setTimeout(() => {
                    glowingText.classList.remove('show-glow');
                }, 5000);

            }, 3000);
        }, 3000);
    }
}

// Sayfa yüklendiğinde 1 saniye bekleyip daktiloyu başlat
window.onload = () => {
    setTimeout(typeWriter, 1000);
};

// 2. Anılar (Resimler ve Yazılar)
// Kendi resimlerini "images/photo1.jpg" şeklinde klasöre atacaksın
const memories = [
    { src: 'images/photo1.jpg', text: 'Gülüşünü izlediğim o an...' },
    { src: 'images/photo2.jpg', text: 'Birlikte kaybolduğumuz sokaklar.' },
    { src: 'images/photo3.jpg', text: 'Seninle her yer evim gibi.' },
    { src: 'images/photo4.jpg', text: 'Bana dünyadaki en şanslı kişi olduğumu hissettiriyorsun.' },
    { src: 'images/photo5.jpg', text: 'Sadece ellerimizi tuttuğumuz o sessizlik...' },
    { src: 'images/photo6.jpg', text: 'Gözlerine baktığımda gördüğüm gelecek.' },
    { src: 'images/photo7.jpg', text: 'İyi ki varsın, iyi ki benimsin.' },
    { src: 'images/photo8.jpg', text: 'Bana her baktığında kalbimin hızlanışı...' },
    { src: 'images/photo9.jpg', text: 'Seninle geçen sıradan bir gün bile mucize gibi.' },
    { src: 'images/photo10.jpg', text: 'Gözlerindeki o sıcak ışık.' },
    { src: 'images/photo11.jpg', text: 'Hayallerimin gerçeğe dönüştüğü yer tam burası.' },
    { src: 'images/photo12.jpg', text: 'Yanındayken zamanın nasıl geçtiğini anlamıyorum.' },
    { src: 'images/photo13.jpg', text: 'Seninle olmak, en sevdiğim şarkıyı dinlemek gibi.' },
    { src: 'images/photo14.jpg', text: 'Sarıldığımda hissettiğim o eşsiz huzur.' },
    { src: 'images/photo15.jpg', text: 'Hikayemizin en güzel anılarından biri.' },
    { src: 'images/photo16.jpg', text: 'Keşke zaman dursa da hep böyle kalsak dediğim anlar.' },
    { src: 'images/photo17.jpg', text: 'Seninle yaşlanmak hayalden de öte.' },
    { src: 'images/photo18.jpg', text: 'Seninle her anımız bir ömre bedel.' },
    { src: 'images/photo19.jpg', text: 'Ellerini tuttuğumda dünyam güzelleşiyor.' },
    { src: 'images/photo20.jpg', text: 'Sen benim başıma gelen en güzel şeysin.' },
    { src: 'images/bos_kutu.jpg', text: 'Bu kutu boş çünkü bir gün seni kaybedersem ne olur diye düşündüm...<br>...ve sadece boşluk ve karanlık hissettim, umarım hiçbir zaman böyle hissetmek zorunda kalmam.' }
];

let currentIndex = 0;
// Ekranda aynı anda çok fazla resim üst üste binmemesi için fare mesafe kontrolü
const SPACING = 200; // Kaç pikselde bir yeni resim çıksın
let lastX = -1000;
let lastY = -1000;

// Fare hareketini dinleme
interactionLayer.addEventListener('mousemove', (e) => {
    // İstersen "if (!isTypingFinished) return;" yazarak yazı bitmeden resim çıkmasını engelleyebilirsin.
    // Şimdilik yazı bitmese bile etrafta gezinirse resim çıkmasını serbest bıraktım.
    
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);

    // Belirlenen mesafe kadar fare hareket ettiyse yeni resim oluştur
    if (dist > SPACING) {
        lastX = e.clientX;
        lastY = e.clientY;
        createMemorySpot(e.clientX, e.clientY);
    }
});

// Telefon/Tablet (Dokunmatik ekran) desteği
interactionLayer.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const dist = Math.hypot(touch.clientX - lastX, touch.clientY - lastY);
    
    if (dist > SPACING) {
        lastX = touch.clientX;
        lastY = touch.clientY;
        createMemorySpot(touch.clientX, touch.clientY);
    }
});

// 3. Resim ve Yazı Kutusunu (Memory Spot) Oluşturma İşlevi
function createMemorySpot(x, y) {
    const memoryIndex = currentIndex % memories.length;
    const memory = memories[memoryIndex];
    currentIndex++;

    // Eğer son kutu (özel boş kutu) ise farenin olduğu yere değil, tam ekranın ortasına sabitle
    if (memoryIndex === memories.length - 1) {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
    }

    // Ana kutuyu oluştur
    const spot = document.createElement('div');
    spot.classList.add('memory-spot');
    spot.style.left = x + 'px';
    spot.style.top = y + 'px';

    // Rastgele hafif bir dönüş açısı verelim (-10 ile +10 derece arası) daha doğal dursun
    const rotation = (Math.random() - 0.5) * 20; 
    spot.style.transform = `translate(-50%, -50%) scale(0.9) rotate(${rotation}deg)`;

    // Fener İkonu
    const lantern = document.createElement('div');
    lantern.classList.add('lantern');
    lantern.innerText = '🏮'; // Fener emojisi

    // Resim taşıyıcı (border ve gölge için)
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');
    
    const img = document.createElement('img');
    img.src = memory.src;
    // Eğer klasörde fotoğraf yoksa (veya adını yanlış yazarsak) kırık resim ikonu çıkmasın
    img.onerror = function() {
        this.style.display = 'none'; // Görüntüyü gizle, arkadaki koyu gri placeholder rengi gözüksün
    };

    // Yazı kısmı
    const text = document.createElement('p');
    text.innerHTML = memory.text; // <br> etiketinin çalışması için innerHTML kullanıldı

    // Elementleri birbirine bağla
    spot.appendChild(lantern);
    imgContainer.appendChild(img);
    spot.appendChild(imgContainer);
    spot.appendChild(text);

    // Ekrana ekle
    interactionLayer.appendChild(spot);

    // Animasyonu yumuşak başlatmak için küçük bir hile (DOM'a eklendikten sonra active class'ı ver)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            spot.classList.add('active');
            // Büyürken (scale 1) açısını koru
            spot.style.transform = `translate(-50%, -50%) scale(1) rotate(${rotation}deg)`;
        });
    });

    // Timeout (Silinme) Mantığı
    let fadeOutTimeout;
    let removeTimeout;

    // Son kutu ise ekranda çok daha uzun (8 saniye) kalsın, normal resimler 2.5 saniye
    const displayDuration = (memoryIndex === memories.length - 1) ? 8000 : 2500; 

    const startFadeOut = () => {
        fadeOutTimeout = setTimeout(() => {
            // Eğer resim hala aydınlatılmışsa (fare üstündeyse) silme
            if (spot.classList.contains('illuminated')) return;

            spot.classList.remove('active');
            spot.style.transform = `translate(-50%, -50%) scale(0.9) rotate(${rotation}deg)`;
            
            // CSS geçiş (transition) süresi (1.5s) bittikten sonra elementi HTML'den tamamen sil
            removeTimeout = setTimeout(() => {
                spot.remove();
            }, 1500);
        }, displayDuration);
    };

    startFadeOut();

    // Fareyle Resmin Üstüne Gelinirse (Fener Yanar)
    spot.addEventListener('mouseenter', () => {
        spot.classList.add('illuminated');
        spot.style.zIndex = "100"; // En öne al
        clearTimeout(fadeOutTimeout);
        clearTimeout(removeTimeout);
    });

    // Fare Resmin Üzerinden Çıkarsa (Fener Söner ve Kaybolma Başlar)
    spot.addEventListener('mouseleave', () => {
        spot.classList.remove('illuminated');
        spot.style.zIndex = "5";
        startFadeOut();
    });

    // Telefon/Tablet (Mobil) için dokunarak yakıp/söndürme desteği
    spot.addEventListener('touchstart', (e) => {
        // Mobilde tarayıcının varsayılan tıklama davranışlarını engelle ki kaydırmayla çakışmasın
        e.stopPropagation(); 
        
        if (spot.classList.contains('illuminated')) {
            // Zaten yanıyorsa Plağı Aç!
            openTurntable(memory, memoryIndex);
        } else {
            // Sönükse Yak
            spot.classList.add('illuminated');
            spot.style.zIndex = "100";
            clearTimeout(fadeOutTimeout);
            clearTimeout(removeTimeout);
        }
    }, {passive: true});

    // Bilgisayarda tıklama ile Plağı Aç
    spot.addEventListener('click', () => {
        openTurntable(memory, memoryIndex);
    });
}

// Plak Çaları Açma Fonksiyonu
function openTurntable(memory, index) {
    // Plak açılınca arka plan müziğini durdur
    bgAudio.pause();

    let musicFile = '';
    
    // Eğer son kutu açıldıysa, ona özel olan Yokluğunda şarkısını çal
    if (index === memories.length - 1) {
        musicFile = 'music/special_music.mp3';
        nowPlayingText.innerText = `Senin için çalıyor: Yokluğunda 🎵`;
    } else {
        // Diğer fotoğraflar için 4 şarkıdan birini rastgele seç
        const randomMusicNumber = Math.floor(Math.random() * 4) + 1;
        musicFile = `music/music${randomMusicNumber}.mp3`;
        nowPlayingText.innerText = `Senin için çalıyor... 🎵`;
    }

    // Fotoğrafı plağın göbeğine yerleştir
    vinylCover.style.backgroundImage = `url(${memory.src})`;
    
    // Müzik dosyasını ayarla ve çal
    audioPlayer.src = musicFile;
    audioPlayer.play().catch(e => console.log("Otomatik oynatma engellendi, etkileşim bekleniyor."));

    // Modalı Göster
    turntableModal.classList.remove('hidden');
    
    // Animasyonları Başlat
    vinyl.classList.add('spinning');
    tonearm.classList.add('playing');
    
    // Yazıyı güncellemeden önce yukarıda ayarladık
}

// Plak Çaları Kapatma
closeModalBtn.addEventListener('click', () => {
    turntableModal.classList.add('hidden');
    audioPlayer.pause();
    vinyl.classList.remove('spinning');
    tonearm.classList.remove('playing');
    
    // Kapatıldığında arka plan müziğini tekrar başlat (Kaldığı yerden)
    bgAudio.play();
});

// Arka plana tıklayınca da kapansın
turntableModal.addEventListener('click', (e) => {
    if (e.target === turntableModal || e.target.classList.contains('modal-overlay')) {
        closeModalBtn.click();
    }
});

// İleri Sarma Butonu İşlevi
skipForwardBtn.addEventListener('click', () => {
    if (!audioPlayer.paused) {
        audioPlayer.currentTime += 15; // 15 saniye ileri sarar
    }
});
