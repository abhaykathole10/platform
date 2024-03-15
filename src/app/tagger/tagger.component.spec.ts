import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggerComponent } from './tagger.component';

describe('TaggerComponent', () => {
  let component: TaggerComponent;
  let fixture: ComponentFixture<TaggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaggerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test onSwitchSide() method', () => {
    component.switchSide = true;
    component.onSwitchSide();
    expect(component.switchSide).toBe(false);
  });

  it('should test areAllPlayersLinedUp() method', () => {
    component.areAllPlayersLinedUp(true);
    expect(component.areAllPlayersFilled).toBe(true);
  });

  it('should enableSubtags() method', () => {
    component.allSubTags = [
      {
        type: 'Completion',
        name: 'Complete',
        category: ['Pass', 'Long Kick', 'Head Pass', 'Hand Pass'],
        disabled: true,
        clicked: false,
        bgColor: '#996633',
      },
    ];

    component.enableSubtags('Pass');

    expect(component.allSubTags).toEqual([
      {
        type: 'Completion',
        name: 'Complete',
        category: ['Pass', 'Long Kick', 'Head Pass', 'Hand Pass'],
        disabled: false,
        clicked: false,
        bgColor: '#996633',
      },
    ]);
  });

  it('should test enableGoalAreas() method', () => {
    component.allGoalAreas = [
      {
        name: 'post',
        category: 'post',
        disabled: true,
        clicked: false,
      },
    ];

    component.enableGoalAreas();

    expect(component.allGoalAreas).toEqual([
      {
        name: 'post',
        category: 'post',
        disabled: false,
        clicked: false,
      },
    ]);
  });

  it('should test handleGoalArea() method', () => {
    const area = {
      name: 'post',
      category: 'post',
      disabled: false,
      clicked: false,
    };

    component.handleGoalArea(area);

    expect(area.clicked).toBe(true);
    expect(component.goalAreaSelected).toEqual('post');
  });

  it('should test exportEvent() method', () => {
    component.currentTeam = 'em';
    component.currentPlayerJersey = '12';
    component.currentPlayerName = 'Camavinga';
    component.currentEvent = 'Pass';
    component.startCoordinates = {
      x: '40',
      y: '22',
    };
    component.endCoordinates = {
      x: '80',
      y: '69',
    };
    component.subtagsSelected = {
      foot: '',
      outcome: 'Complete',
      keypass: false,
      assist: false,
      throughpass: false,
      clearance: false,
      takeon: false,
      handfoul: false,
    };
    const eventData = {
      id: jasmine.any(String),
      team: 'em',
      time: '',
      jersey: '12',
      name: 'Camavinga',
      event: 'Pass',
      start: {
        x: '40',
        y: '22',
      },
      end: {
        x: '80',
        y: '69',
      },
      subEvents: {
        foot: '',
        outcome: 'Complete',
        keypass: false,
        assist: false,
        throughpass: false,
        clearance: false,
        takeon: false,
        handfoul: false,
      },
      goalArea: '',
    };

    const addEventData = spyOn<any>(component['eventService'], 'addEventData');

    component.exportEvent();

    expect(addEventData).toHaveBeenCalledWith(eventData);
  });

  it('should test getVideoId() method', () => {
    const url = 'https://www.youtube.com/watch?v=wJzzaqBxGOU';
    const res = component.getVideoId(url);
    expect(res).toEqual('wJzzaqBxGOU');
  });

  describe('it should test setEventTimeStamp() method', () => {
    it('should set current time and call formatTime() method for local video upload', () => {
      const formatTimeSpy = spyOn(component, 'formatTime').and.returnValue('5');

      component.localUpload = true;
      component.localVideoPlayer = {
        nativeElement: {
          currentTime: 5,
        },
      };

      component.setEventTimeStamp();

      expect(formatTimeSpy).toHaveBeenCalledWith(5);
      expect(component.currentTime).toEqual('5');
    });

    it('should set current time and call formatTime() method for youtube video player', () => {
      const formatTimeSpy = spyOn(component, 'formatTime').and.returnValue('5');

      component.youtubeUpload = true;
      const playerYTMock = {
        getCurrentTime: jasmine.createSpy('getCurrentTime').and.returnValue(5),
        seekTo: jasmine.createSpy('seekTo'),
      };
      component.playerYT = playerYTMock;

      component.setEventTimeStamp();

      expect(playerYTMock.getCurrentTime).toHaveBeenCalled();
      expect(formatTimeSpy).toHaveBeenCalledWith(5);
      expect(component.currentTime).toEqual('5');
    });
  });

  describe('it should test handleBackward() method', () => {
    it('should seek back youtube video by 1 sec', () => {
      // Mock playerYT and set current time
      const playerYTMock = {
        getCurrentTime: jasmine.createSpy('getCurrentTime').and.returnValue(5),
        seekTo: jasmine.createSpy('seekTo'),
      };
      component.playerYT = playerYTMock;

      component.handleBackward();

      expect(playerYTMock.getCurrentTime).toHaveBeenCalled();

      expect(playerYTMock.seekTo).toHaveBeenCalledWith(4, true);
    });

    it('should seek back local video player by 1 sec', () => {
      component.playerYT = undefined;
      component.localVideoPlayer = {
        nativeElement: {
          currentTime: 5,
        },
      };

      component.handleBackward();

      expect(component.localVideoPlayer.nativeElement.currentTime).toEqual(4);
    });
  });

  describe('it should test handleForward() method', () => {
    it('should seek front youtube video by 1 sec', () => {
      // Mock playerYT and set current time
      const playerYTMock = {
        getCurrentTime: jasmine.createSpy('getCurrentTime').and.returnValue(5),
        seekTo: jasmine.createSpy('seekTo'),
      };
      component.playerYT = playerYTMock;

      component.handleForward();

      expect(playerYTMock.getCurrentTime).toHaveBeenCalled();

      expect(playerYTMock.seekTo).toHaveBeenCalledWith(6, true);
    });

    it('should seek back local video player by 1 sec', () => {
      component.playerYT = undefined;
      component.localVideoPlayer = {
        nativeElement: {
          currentTime: 5,
        },
      };

      component.handleForward();

      expect(component.localVideoPlayer.nativeElement.currentTime).toEqual(6);
    });
  });

  describe('testing onVideoUpload() method', () => {
    it("should set localUpload true and youtubeUpload false if it's a local video upload", () => {
      const event = {
        url: 'a',
        videoUploaded: true,
        format: 'video',
        source: 'local',
      };

      component.onVideoUpload(event);

      expect(component.localUpload).toBe(true);
      expect(component.youtubeUpload).toBe(false);
    });

    it("should set localUpload false and youtubeUpload true if it's a youtube video upload and later call initYoutubePlayer() method", () => {
      const event = {
        url: 'a',
        videoUploaded: true,
        format: 'video',
        source: 'youtube',
      };
      const initYoutubePlayerSpy = spyOn<any>(component, 'initYoutubePlayer');

      component.onVideoUpload(event);

      expect(component.localUpload).toBe(false);
      expect(component.youtubeUpload).toBe(true);
      expect(initYoutubePlayerSpy).toHaveBeenCalled();
    });
  });
});
