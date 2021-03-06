import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { Rental } from 'src/app/models/rental';
import { CarDetailService } from 'src/app/services/car-detail.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  
  rental:Rental;
  carDetail: CarDetail;
  amountOfPayment:number = 0;

  constructor(
    private activatedRoute:ActivatedRoute,
    private carDetailService:CarDetailService,
    private router:Router,
    private toastr:ToastrService,
    private paymentService: PaymentService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params["rental"]){
        this.rental = JSON.parse(params['rental']);
        this.getRental();
        this.getCarDetails();
      }
    })
  }

  getRental(){
    console.log(this.rental);
  }
  getCarDetails(){
    this.carDetailService.getCarDetails().subscribe(response => {
      this.carDetail = response.data[0];
      this.paymentCalculator(); 
    })
  }

  paymentCalculator(){
    if(this.rental.returnDate != null){
      var date1 = new Date(this.rental.returnDate.toString());
      var date2 = new Date(this.rental.rentDate.toString());
      var difference = date1.getTime() - date2.getTime();

      var numberOfDays = Math.ceil(difference / (1000 * 3600 * 24));

      this.amountOfPayment = numberOfDays * this.carDetail.dailyPrice;
      if(this.amountOfPayment <= 0){
        this.router.navigate(['/cars']);
        this.toastr.error("Hatalı işlem") 
      }
    }
  }

  pay(){
    this.paymentService.pay(this.rental, this.amountOfPayment).subscribe(response => {
      this.router.navigate(['/cars']);
      this.toastr.success(response.message.toString(), "İşlem Başarılı");
    })
  }

}
