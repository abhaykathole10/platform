import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggerComponent } from './tagger.component';
import { ALLSUBTAGS } from '../shared/app.constants';

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
      id: (new Date().getTime() + 1).toString(),
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
