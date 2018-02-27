import { RawDataGenerator } from "./RawDataGenerator";
import { DateTimeLimits } from "../limits/DateTimeLimits";
import { RandomDateTime } from "../random/RandomDateTime";
import { isDefined } from '../../util/TypeChecking';
import { LocalDateTime, Period, ChronoUnit } from "js-joda";

export class DateTimeGenerator implements RawDataGenerator< LocalDateTime > {

    private readonly _min: LocalDateTime;
    private readonly _max: LocalDateTime;

	/**
	 * Constructor.
	 * 
	 * @param _randomDateTimeGen Random generator.
	 * @param min Minimum value. Optional. Assumes the minimum datetime if not defined.
	 * @param max Maximum value. Optional. Assumes the maximum datetime if not defined.
	 * 
	 * @throws Error In case of invalid values.
	 */
    constructor(
		private _randomDateTimeGen: RandomDateTime,
		min?: LocalDateTime,
		max?: LocalDateTime
	) {		
		if ( isDefined( min ) && isDefined( max ) && min.isAfter( max ) ) {
            throw new Error( 'min datetime should not be greater than max' );
        }
        this._min = isDefined( min ) ? min: DateTimeLimits.MIN;
		this._max = isDefined( max ) ? max: DateTimeLimits.MAX;	
    }

	public diffInSeconds(): number {
        return this._min.until( this._max, ChronoUnit.SECONDS );
	}

	public hasValuesBetweenMinAndMax(): boolean {
		return this.diffInSeconds() > 0;
	}

	public hasValuesBelowMin(): boolean {
		return this._min.isAfter( DateTimeLimits.MIN );
	}

	public hasValuesAboveMax(): boolean {
        return this._max.isBefore( DateTimeLimits.MAX );
	}    

	// DATA GENERATION

	/** @inheritDoc */
	public lowest(): LocalDateTime {
		return DateTimeLimits.MIN;
    }

    /** @inheritDoc */
	public randomBelowMin(): LocalDateTime {
		return ( this.hasValuesBelowMin() )
			? this._randomDateTimeGen.before( this._min )
			: this.lowest();
    }
    
    /** @inheritDoc */
	public justBelowMin(): LocalDateTime {
		return ( this.hasValuesBelowMin() )
			? this._min.minusSeconds( 1 )
			: this.lowest();
    }
    
    /** @inheritDoc */
	public min(): LocalDateTime {
		return this._min;
    }
    
    /** @inheritDoc */
	public justAboveMin(): LocalDateTime {
		return ( this.hasValuesBetweenMinAndMax() )
			? this._min.plusSeconds( 1 )
			: this._min;
    }
    
    /** @inheritDoc */
    public zero(): LocalDateTime {
        return this.lowest();
    }

    /** @inheritDoc */
	public median(): LocalDateTime {
       
        const diffInDaysOfDates = Period.between( this._min.toLocalDate(), this._max.toLocalDate() ).days();

        const minTime = this._min.toLocalTime();
        const maxTime = this._max.toLocalTime();
        const diffInSecondsOfTimes = minTime.until( maxTime, ChronoUnit.SECONDS );

        const days = Math.round( ( diffInDaysOfDates - 1 ) / 2 );
        const seconds = Math.round( ( diffInSecondsOfTimes - 1 ) / 2 );

        let r = this._min.plusDays( days );
        if ( maxTime.compareTo( minTime ) > 0 ) { // maxTime greater than minTime
            return r.plusSeconds( seconds );
        }
        return r.minusMonths( seconds );
    }
    
    /** @inheritDoc */
	public randomBetweenMinAndMax(): LocalDateTime {
        return this.hasValuesBetweenMinAndMax()
            ? this._randomDateTimeGen.between( this._min.plusSeconds( 1 ), this._max.minusSeconds( 1 ) )
            : this._min;
    }
    
    /** @inheritDoc */
    public justBelowMax(): LocalDateTime {
        return this.hasValuesBetweenMinAndMax()
            ? this._max.minusSeconds( 1 )
            : this._max;
    }
    
    /** @inheritDoc */
	public max(): LocalDateTime {
		return this._max;
    }
    
    /** @inheritDoc */
    public justAboveMax(): LocalDateTime {
        return this.hasValuesAboveMax()
            ? this._max.plusSeconds( 1 )
            : this.greatest();
	}	

    /** @inheritDoc */
	public randomAboveMax(): LocalDateTime {
		return this.hasValuesAboveMax()
			? this._randomDateTimeGen.after( this._max )
			: this.greatest();
	}

	/** @inheritDoc */
	public greatest(): LocalDateTime {
		return DateTimeLimits.MAX;
	}    
        
}